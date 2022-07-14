<script lang="typescript">
    import { showPopover } from '@nativescript-community/ui-popover/svelte';
    import PopoverComponent from './PopoverComponent.svelte';

    function openPopover(event) {
        showPopover({
            anchor: event.object,
            view: PopoverComponent,
            props:{
                title:'my popover'
            }
        });
    }
</script>

<page>
    <actionBar title="Basic Drawer" />
    <gridlayout>
        <button text="Open Popover" class="button" on:tap={openPopover} verticalAlignment="center" horizontalAlignment="center" />
    </gridlayout>
</page>

<style>
    ActionBar {
        background-color: #b52e31;
        color: white;
    }
    Button {
        background-color: #b52e31;
        color: white;
    }
</style>
