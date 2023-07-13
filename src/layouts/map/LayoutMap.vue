<script>
    import FooterLayout from "./FooterLayout.vue";
    import SidebarLayout from "./SidebarLayout.vue";
    export default {
        components: {
            FooterLayout,
            SidebarLayout
        }
    }

</script>

<template>
    <div id="layout-wrapper">
        <SidebarLayout />
        <div class="vertical-overlay"></div>
        <div class="main-content p-0 m-0">
            <div class="page-content p-0 m-0">
                <div class="container-fluid">
                    <slot />
                </div>
            </div>
        </div>
        <FooterLayout />
    </div>
</template>