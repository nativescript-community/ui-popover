<template>
    <StackLayout orientation="vertical">
        <label :text="colorcode" row={1} textAlignment="center" />
        <Button :text="fontclose" color="red" class="mdi" @tap="close"/>
    </StackLayout>
</template>

<script lang="ts" setup>
import { defineProps, ref } from "nativescript-vue";
import { Color, StackLayout } from "@nativescript/core"
import { usePopover } from '@nativescript-community/ui-popover/vue3';
const { closePopover }=usePopover()

const props = defineProps({
    color: {
        type: [String, Color],
        required: true,
    },
})
const fontclose = "\uf136"
const colorcode = ref(`color code is ${props.color}`)
async function close(){
    closePopover()
}
</script>