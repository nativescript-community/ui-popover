<!-- ⚠️ This README has been generated from the file(s) "blueprint.md" ⚠️--><!-- ⚠️ This README has been generated from the file(s) "blueprint.md" ⚠️-->
<!--  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      DO NOT EDIT THIS READEME DIRECTLY! Edit "bluesprint.md" instead.
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
<h1 align="center">@nativescript-community/ui-popover</h1>
<p align="center">
		<a href="https://npmcharts.com/compare/@nativescript-community/ui-popover?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/@nativescript-community/ui-popover.svg" height="20"/></a>
<a href="https://www.npmjs.com/package/@nativescript-community/ui-popover"><img alt="NPM Version" src="https://img.shields.io/npm/v/@nativescript-community/ui-popover.svg" height="20"/></a>
	</p>

<p align="center">
  <b>Popover plugn</b></br>
  <sub><sub>
</p>

<br />



[](#table-of-contents)


[](#table-of-contents)

## Table of Contents

* [Installation](#installation)
* [API](#api)
	* [Using Svelte](#using-svelte)
	* [Using Vue](#using-vue)
	* [Methods](#methods)
* [Demos and Development](#demos-and-development)
	* [Setup](#setup)
	* [Build](#build)
	* [Demos](#demos)
* [Questions](#questions)


[](#installation)


[](#installation)

## Installation
Run the following command from the root of your project:

`ns plugin add @nativescript-community/ui-popover`


[](#api)


[](#api)

## API

### Using Svelte
```ts
  import { showPopover } from '@nativescript-community/ui-popover/svelte';

  showPopover({
    view: YourInnerSvelteComponent,
    props: {}
  });
```

### Using Vue
```ts
  import PopoverPlugin from '@nativescript-community/ui-popover/vue';
  Vue.use(PopoverPlugin);

  //in your components
  this.$showPopover(YourInnerVueComponent, {
    props: {}
  });
```

### Methods
```ts
 interface PopoverOptions {
    anchor: View;
    vertPos?: VerticalPosition;
    horizPos?: HorizontalPosition;
    x?: number;
    y?: number;
    fitInScreen?: boolean;
    onDismiss?: Function;
}
```

| Name         | Return | Description                                     |
| ------------ | ------ | ----------------------------------------------- |
| showPopover(options: PopoverOptions)       | `void` | Programatically open the popover                 |
| closePopover(options: PopoverOptions)      | `void` | Programatically close the popover                |


[](#demos-and-development)


[](#demos-and-development)

## Demos and Development


### Setup

To run the demos, you must clone this repo **recursively**.

```
git clone https://github.com/@nativescript-community/ui-popover.git --recursive
```

**Install Dependencies:**
```bash
npm i # or 'yarn install' or 'pnpm install'
```

**Interactive Menu:**

To start the interactive menu, run `npm start` (or `yarn start` or `pnpm start`). This will list all of the commonly used scripts.

### Build

```bash
npm run build

npm run build.angular # or for Angular
```

### Demos

```bash
npm run demo.[ng|react|svelte|vue].[ios|android]

npm run demo.svelte.ios # Example
```

[](#questions)


[](#questions)

## Questions

If you have any questions/issues/comments please feel free to create an issue or start a conversation in the [NativeScript Community Discord](https://nativescript.org/discord).