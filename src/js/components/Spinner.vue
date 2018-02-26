<template>
    <div class="spinner">
        <svg viewBox="0 0 64 64">
            <g>
                <circle
                        stroke-width="4"
                        stroke-dasharray="100"
                        stroke-dashoffset="82"
                        stroke="currentColor"
                        r="26"
                        cx="32"
                        cy="32"
                        fill="none"
                ></circle>
            </g>
        </svg>
    </div>
</template>

<script>
    export default {
        name: 'Spinner',
    };
</script>

<style lang="scss">
    @import '../../scss/variables/colors';

    .spinner {
        color: $colorWhite;
        width: 30px;
        height: 30px;
        animation: rotate 1s infinite linear;
    }

    @keyframes rotate {
        from {
            transform: rotate(0);
        }

        to {
            transform: rotate(360deg);
        }
    }
</style>