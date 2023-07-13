<template>
    <div class="offcanvas" :class="offcanvas_type" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" :id="offcanvasID">
        <div class="offcanvas-header border-bottom">
            <h3 class="offcanvas-title">{{heading}}</h3>
            <slot name="head_center"></slot>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body p-0 overflow-hidden">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'OffsetCanvas',
        props: {
            offcanvasID: {
                type: String,
                default: '',
            },
            offcanvas_type: {
                type: String,
                default: 'offcanvas-bottom',
            },
            heading: {
                type: String,
                default: '',
            }
        }
    }

</script>