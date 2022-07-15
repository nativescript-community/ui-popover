<script lang="ts">
    export let title: string = null;
    export let min = 0;
    export let max = 1;
    export let value = 0;
    export let backgroundColor = 'white';
    export let onChange = null;
    export let formatter = (value) => value + '';

    function onValueChange(event) {
        if (onChange) {
            onChange(event.value);
        }
    }
</script>

<gridLayout width="80%" rows="auto" {backgroundColor}>
    <gridLayout rows="auto,auto" columns="auto,*,auto" padding="0 10 0 10" borderRadius={4} margin="2">
        {#if title}
            <label text={title} col={1} marginTop="0" />
        {/if}
        <label text={formatter(min)} row={1} textAlignment="center" />
        <label text={formatter(max)} row={1} col={2} textAlignment="center" />
        <slider row={1} col={1} {value} on:valueChange={onValueChange} minValue={min} maxValue={max} />
    </gridLayout>
</gridLayout>
