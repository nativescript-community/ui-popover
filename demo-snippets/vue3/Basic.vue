<template>
    <Frame>
        <Page actionBarHidden="true">
            <ListView ref="collection" height="100%" width="100%" separatorColor="transparent" :items="itemList"
                colWidth="50%" rowHeight="100">
                <template #default="{ item }">
                    <StackLayout :backgroundColor="item.color" height="100" @longPress="onLongPress">
                        <Label :text="item.name" />
                    </StackLayout>
                </template>
            </ListView>
        </Page>
    </Frame>
</template>

<script lang="ts" setup>

import { ref } from 'nativescript-vue'
import { EventData, StackLayout } from "@nativescript/core"
import { usePopover } from '@nativescript-community/ui-popover/vue3';

import ColorHelp from './ColorHelp.vue'
const { showPopover } = usePopover()

interface Card {
    name: string
    color: string
}
const itemList = ref<Card[]>([
    { name: 'TURQUOISE', color: '#1abc9c' },
    { name: 'EMERALD', color: '#2ecc71' },
    { name: 'PETER RIVER', color: '#3498db' },
    { name: 'AMETHYST', color: '#9b59b6' },
    { name: 'WET ASPHALT', color: '#34495e' },
    { name: 'GREEN SEA', color: '#16a085' },
    { name: 'NEPHRITIS', color: '#27ae60' },
    { name: 'BELIZE HOLE', color: '#2980b9' },
    { name: 'WISTERIA', color: '#8e44ad' },
    { name: 'MIDNIGHT BLUE', color: '#2c3e50' },
    { name: 'SUN FLOWER', color: '#f1c40f' },
    { name: 'CARROT', color: '#e67e22' },
    { name: 'ALIZARIN', color: '#e74c3c' },
    { name: 'CLOUDS', color: '#ecf0f1' },
    { name: 'CONCRETE', color: '#95a5a6' },
    { name: 'ORANGE', color: '#f39c12' },
    { name: 'PUMPKIN', color: '#d35400' },
    { name: 'POMEGRANATE', color: '#c0392b' },
    { name: 'SILVER', color: '#bdc3c7' },
    { name: 'ASBESTOS', color: '#7f8c8d' }
]);


async function onLongPress(evt: EventData) {
    let anchor = evt.object as StackLayout
    let color = anchor.backgroundColor
    await showPopover(ColorHelp, { anchor: anchor, props: { "color": color } })
}
</script>