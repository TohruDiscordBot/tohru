<p align="center">
  <img src="https://raw.githubusercontent.com/TohruDiscordBot/tohru/dev/assets/Tohru_2.png" />
</p>

# Tohru

The repository for Tohru Bot. Written in DiscordJS

## How to run

Prerequisites:

- A MongoDB instance
- NodeJS 16 installed
- A Discord application with bot ready
- (Optional) Global Typescript compiler

Clone the repository using the command below

```bash
git clone https://github.com/TohruDiscordBot/tohru --branch <branch name>
```

It is highly recommended that you clone the `main` branch as it is more stable.
If you are an experienced user or you want to contribute to this repository, you
can clone the `dev` branch to experiment things as you like.

After cloning the repository, fire up a terminal with the working directory
being the same as the repository's root directory

Install all dependencies

```bash
npm install
```

After installing all dependencies, configure the bot by copying and renaming the
`.env.example` file. Fill all fields in as instructed in the file

You may notice there is a directory called `conf` that is where configurations
for some of the bot's modules to work. It is currently mandatory to create and
fill out all those files for the bot to be working

Then build the project

```bash
npm run build
```

You can also use `tsc` command if you already have global Typescript compiler
installed

You can now run the bot. Simply typing this into the console

```bash
npm start
```

## Contribution

All contributions are welcomed. Simply clone the dev branch and make a pull
request if you want to change anything
