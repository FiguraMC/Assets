# Figura Assets

This repository contains all of Figura's assets, that being emojis, translations.

## Translations

Translations are managed through Weblate: https://translate.figuramc.org/projects/figuramc/figura/

## Emojis

Figura members can add custom emojis to display in-game. This can be done locally by modifying the local-cache or using a resource pack. Of course, you can create a pull request to have your emojis added directly.

### 1) Creating a fork:

_If you've already created a fork of Figura, skip to step 2._

Before you can do anything, you must first create a fork of this repository. Click on the button at the top that says "Fork", then click "Create fork" on the page you're directed to.

With a fork of Figura, you'll be able to make changes and modifications.

### 2) Adding your emoji(s):

Figura has several emoji sets which can be viewed in-game by running the `/figura emojis` command.

You'll need to modify 3 files to add your emoji:

- [v2/textures](v2/textures/) - Emoji spritesheet
- [v2/emojis](v2/emojis/) - Emoji aliases
- [v2/font](v2/font/) - Emoji charset

After you've added your texture to the spritesheet, you'll want to add its aliases. Keep in mind the emoji you've added your emoji next to.

Let's say we've drawn a portrait emoji on the second to last column on the second row.

```json
{
  "emojis": {
    ...
    "\uE00C":["@4p5"],
    "\uE00D":["@4p5_hair"],
    "\u0000":[], // <- Here
    "\u0000":[],

	...
  }
}
```

The emoji prior uses the unicode representation `\uE00D`. Counting up in base16, the next key would be `\uE00E`. Change the `\u0000` key to the key you've found and add your aliases.

```json
    "\uE00E":["@steve","@sigma"],
```

Using the same key, navigate to and modify the charset at the same position. Change the `\u0000` key to the key you've found and add your aliases.

It helps to know where on the texture your emoji is located for this one.

```json
{
  "providers": [
    {
      "chars": [
        ...
        "\uE008\uE009\uE00A\uE00B\uE00C\uE00D\u0000\u0000",
		... //                                ------ Here
      ]
    }
  ]
}
```
