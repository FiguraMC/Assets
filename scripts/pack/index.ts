import fsp from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import toml from "toml";
import { z } from "zod";

const args = process.argv.slice(2);

if (args.length !== 2) {
	console.error("Usage: pack <input> <output>");
	process.exit(1);
}

const inputPath = path.resolve(args[0]);
const outputPath = path.resolve(args[1]);

const texturesOutputPath = path.join(outputPath, "textures/font/emojis");
const emojiDefsOutputPath = path.join(outputPath, "emojis");
const fontsOutputPath = path.join(outputPath, "font");

await fsp.mkdir(texturesOutputPath, { recursive: true });
await fsp.mkdir(emojiDefsOutputPath, { recursive: true });
await fsp.mkdir(fontsOutputPath, { recursive: true });

const emojisPath = path.join(inputPath, "emojis");
const emojisConfigPath = path.join(inputPath, "emojis.toml");

const emojiConfigSchema = z.record(
	z.string(),
	z.object({
		emojis: z.record(
			z.string(),
			z
				.union([
					z.array(z.string()).min(1),
					z.object({
						names: z.array(z.string()).min(1),
						shortcuts: z.array(z.string()).optional().default([]),
						blacklisted: z.boolean().optional().default(false),
						frames: z
							.object({
								count: z.number().int().positive(),
								time: z.number().int().positive(),
							})
							.optional(),
					}),
				])
				.transform((value) =>
					Array.isArray(value)
						? { names: value, shortcuts: [], blacklisted: false }
						: value,
				),
		),
	}),
);

const emojisDefintion = await fsp
	.readFile(emojisConfigPath, "utf-8")
	.then(toml.parse)
	.then(emojiConfigSchema.parse);

function createAtlas(
	rows: number,
	cols: number,
	tileWidth: number,
	tileHeight: number,
	images: Buffer[],
) {
	const atlasWidth = cols * tileWidth;
	const atlasHeight = rows * tileHeight;

	const atlas = sharp({
		create: {
			width: atlasWidth,
			height: atlasHeight,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		},
	}).composite(
		images.map((image, index) => ({
			input: image,
			top: Math.floor(index / cols) * tileHeight,
			left: (index % cols) * tileWidth,
		})),
	);

	return atlas;
}

for (const category in emojisDefintion) {
	const categoryPath = path.join(emojisPath, category);

	const emojis = emojisDefintion[category].emojis;
	const emojiNames = Object.keys(emojis);

	const emojisImages = Object.fromEntries(
		await Promise.all(
			emojiNames.map(async (emojiName) => {
				const emojiPath = path.join(categoryPath, `${emojiName}.png`);

				return [emojiName, sharp(emojiPath)] as const;
			}),
		),
	);

	const { width, height } = await emojisImages[emojiNames[0]].metadata();

	if (!width || !height) {
		throw new Error(`Could not get the dimensions of ${emojiNames[0]}`);
	}

	const dimensionsMatch = await Promise.all(
		Object.values(emojisImages).map((image) => image.metadata()),
	).then((metadata) =>
		metadata.every((m) => m.width === width && m.height === height),
	);

	if (!dimensionsMatch) {
		throw new Error(
			`Not all emojis in the ${category} have the same dimensions`,
		);
	}

	const rows = Math.ceil(Math.sqrt(emojiNames.length));
	const cols = Math.ceil(Math.sqrt(emojiNames.length));

	const images = await Promise.all(
		emojiNames.map((emojiName) => emojisImages[emojiName].toBuffer()),
	);

	const atlas = createAtlas(rows, cols, width, height, images);
	const atlasOutputPath = path.join(texturesOutputPath, `${category}.png`);

	await atlas.toFile(atlasOutputPath);

	const codepoints = emojiNames.map((_, i) => String.fromCodePoint(0xe000 + i));
	const charmap = Array.from({ length: rows }, (_, row) =>
		codepoints.slice(row * cols, (row + 1) * cols).join(""),
	);

	const font = {
		providers: [
			{
				type: "bitmap",
				file: `figura:font/emojis/${category}.png`,
				ascent: height,
				chars: charmap,
			},
		],
	};

	await fsp.writeFile(
		path.join(fontsOutputPath, `${category}.json`),
		JSON.stringify(font),
	);

	const blacklist: string[] = [];
	const emoijiDefRecord = Object.fromEntries(
		emojiNames.map((emojiName, i) => {
			const codepoint = codepoints[i];

			const { names, shortcuts, blacklisted, frames } = emojis[emojiName];

			if (blacklisted) {
				blacklist.push(codepoint);
			}

			return [
				codepoint,
				{
					names,
					shortcuts,
					...(frames && { frames: frames.count, frametime: frames.time }),
				},
			] as const;
		}),
	);

	await fsp.writeFile(
		path.join(emojiDefsOutputPath, `${category}.json`),
		JSON.stringify({ blacklist, emojis: emoijiDefRecord }),
	);
}
