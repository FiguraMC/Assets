# Figura Assets

This repository contains all of Figura's assets, that being emojis, translations.

## Translations

Translations are managed through Weblate: https://translate.figuramc.org/projects/figuramc/figura/

## Emojis

Figura members can add custom emojis to display in-game. This can be done locally by modifying the local-cache or using a resource pack. Of course, you can create a pull request to have your emojis added directly.

### 1) Creating a fork:

_If you've already created a fork of the assets, skip to step 2._

Before you can do anything, you must first create a fork of this repository. Click on the button at the top that says "Fork", then click "Create fork" on the page you're directed to.

With a fork of the assets, you'll be able to make changes and modifications.

### 2) Creating your emoji(s):

There are a few guidelines you must follow when creating an emoji:

- **Existing emojis:** Do not move, remove, sort, or otherwise change the aliases, category, or unicode character of existing emojis.
- **Color palette:** Figura emojis should follow the color palette [v2/palette/palette.png](v2/palette/palette.png). You do not need to follow the palette if you are making a portrait.
- **Portraits:** In order to have your portrait added, you must be a Figura donator.

Navigate to [v2/textures/font/emojis](v2/textures/font/emojis) and find the category you want to add emojis to. You can run `/figura emojis <category>` in-game to view all the emojis that currently exist.

Once you are in the texture, draw the emojis you'd like to be added. Be sure to keep track of these to make further steps easier.

### 3) Adding your emoji(s):

You'll need to modify 2 additional files to add your emoji:

- [v2/emojis](v2/emojis) - Emoji aliases
- [v2/font](v2/font) - Emoji charset

#### Aliases:

After you've added your texture to the spritesheet, you'll want to add its aliases.

Let's say we've drawn a portrait emoji on the second to last column on the second row. [v2/emojis/portrait.json#L19](v2/emojis/portrait.json#L19)

```jsonc
"\uE00C":["@4p5"],
"\uE00D":["@4p5_hair"],
"\u0000":[], // <- Here
"\u0000":[],
```

The emoji prior to ours uses the unicode character `\uE00D`. Counting up in [Hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal), the next key would be `\uE00E`. Modify the `\u0000` to this new key, and add your aliases.

```jsonc
"\uE00C":["@4p5"],
"\uE00D":["@4p5_hair"],
"\uE00E":["@steve","@sigma"],
"\u0000":[],
```

#### Charset:

The last file you'll have to modify is the charset.

Using the same unicode character you found earlier, add it to the charset grid at the same position. [v2/font/emoji_portrait.json#L9C46-L9C52](v2/font/emoji_portrait.json#L9C46-L9C52)

```jsonc
"\uE000\uE001\uE002\uE003\uE004\uE005\uE006\u0000",
"\uE008\uE009\uE00A\uE00B\uE00C\uE00D\u0000\u0000", // <- Here
"\uE010\uE011\uE012\uE013\uE014\uE015\uE016\uE017",
"\uE018\uE019\uE01A\uE01B\uE01C\uE01D\uE01E\uE01F",
"\uE020\uE021\uE022\uE023\uE024\uE025\uE026\uE027",
"\uE028\uE029\uE02A\uE02B\uE02C\uE02D\uE02E\uE02F",
"\uE030\uE031\uE032\uE033\uE034\uE035\uE036\uE037",
"\uE038\uE039\uE03A\uE03B\uE03C\uE03D\uE03E\uE03F",
"\uE040\uE041\u0000\u0000\u0000\u0000\u0000\u0000"
```

The `\uE00E` is used to replace the `\u0000` here.

```jsonc
"\uE008\uE009\uE00A\uE00B\uE00C\uE00D\uE00E\u0000",
//                                      ^
```

### 4) Creating a pull request:

After you've saved your 3 files and uploaded your changes to Github, you'll want to create a [Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests). Click the "Contribute" button at the top of your repository to open a pull request.

You will then want to contact a Figura artist through Discord. You can DM or ping them in the Discord mentioning your PR, but please be courteous of their time and only ping them if they are online. They will then give you further instructions and a potential ETA of when your emoji will be added.
