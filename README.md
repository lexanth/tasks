[![Build Status](https://travis-ci.org/lexanth/tasks.svg?branch=master)](https://travis-ci.org/lexanth/tasks)

## About

This is an app a bit like Trello, but much simpler. It's totally offline, no server, no synchronisation. Mainly because I wanted something like Trello at work but wasn't allowed to use a cloud service (and offline capability is handy sometimes).

The board layout is saved in a file in the standard application data path (OS-specific). I suppose you could sync it with something like Dropbox, but that would kind of defeat the point.

Suggestions welcome, but should be within this brief.

## Tech

- TypeScript
  - Might convert to pure ES6 at some point. This was mainly an experiment, and I don't love it or feel I get much benefit from the types.
- React
- Redux
- Styled-components
- Electron
- React-beautiful-dnd
- Reakit
- Immer
  - Love this guy
- PrismJS

## Development

Two options for running dev mode.

I like to run the electron host and the webpack dev server in separate terminals:

```
yarn start
yarn electron-start
```

There is a script to run these in one:

```
yarn electron-dev
```

TypeScript checking runs in the background. ESLint and Prettier are in use. Not got round to writing any tests yet - this was mainly a bit of an experiment.
