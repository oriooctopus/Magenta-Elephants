# 4.um

> Personalized, interactive forum for software developers.

## Team

  - Ali Elgiadi
  - He Liu
  - Michael Sermersheim
  - Oliver Ullman

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Roadmap](#roadmap)
1. [Contributing](#contributing)

## Git Workflow

1. Type: git remote add upstream https://github.com/Magenta-Elephants/Magenta-Elephants
2. (ensure you are on master branch) type: git checkout master
3. (Sync local master with org’s master) type: git pull --rebase upstream master
4. Create a feature branch, type: git checkout -b <name_of_branch>
5. BEFORE SUBMITTING YOUR NEW CHANGES:
    1. git add .
    2. git commit
    3. git pull --rebase upstream master
6. git push origin <name_of_branch>
7. PULL REQUEST WITH GITHUB
8. Team member reviews code and decides whether to merge or not
9. IF ACCEPTED/MERGED
10. (Switch back to master) type: git checkout master
11. (Delete local branch) type: git branch -D <name_of_branch>
12. type: git pull --rebase upstream master
13. git push origin master

## Usage

> Where software developers of all skill levels and specialties can come together for trustworthy guidance and positive contributions to their community's growth.

## Requirements

- React
- Express
- MySql
- Socket

## Development

### Installing Dependencies

From within the root directory:

- NPM install

### Getting Started 

- NPM run react-dev
- NPM run server-dev
- From the root directory run node spec/populate.js
- Go to localhost:3000

### Roadmap

View the project roadmap [here](https://docs.google.com/spreadsheets/d/11bYC2KRd66zInBLLcNDz3N_pXp-PYVqoKgE5KwQhAaE/edit#gid=0)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
