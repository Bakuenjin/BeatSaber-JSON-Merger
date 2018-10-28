# BeatSaber-JSON-Merger
A small helpful tool for merging beatsaber map files (.json) in collaborative projects with multiple mappers (or lighters).

## How to use:
You have two options here:
1. Simply download my release version (https://github.com/Bakuenjin/BeatSaber-JSON-Merger/releases)
2. Setup node.js and clone this repository

## Whats already working:
 - Selecting .json map for basic information like NoteJumpSpeed or BPM
 - Selecting a folder containing all map parts as .json files (While the program is checking for file extension, I highly recommend to only place map files in that folder)
 - Simple validation of map parts by showing which map parts have overlapping notes / obstacles or lighting events (which means one file should **always** contain just one continuous part, otherwise this tool won't work)
 - Generating a fully working beatmap file (.json) with the selected parts

## Future ideas:
 - Making it possible to specify one lighting event file (similar to selecting one file for basic map information)
 - Adding warning for possible bad transitions between parts
 - Adding possibility to modify basic information within this tool
 - Maybe even something funky like a basic auto-fix functionality for bad transitions
 
 If you have an idea for a nice functionality I could add, feel free to open an issue or write me on Discord: **Bakuenjin#0001**

## Last words:
Yes this tool is unpacked 120mb large. I am fairly new to node.js and electron and have no experience with reducing the amount of modules I need to ship with this program.

If someone from you has experience with this and might help me reducing release sizes, I am always happy to learn from you guys. Hit me up on Discord: **Bakuenjin#0001**
