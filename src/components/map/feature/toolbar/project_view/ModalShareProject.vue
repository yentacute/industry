<!-- Mỗi một chức năng sẽ viết riêng theo component 
Phần này được đặt trong Head -->

<script>
import { ref } from 'vue';
import { successToast, errorToast } from '../../../../../helpers/api/toastStyle';
import { useSharingStore } from '../../../../../state/map_control/sharing';

export default {
    props: {
    },
    data: function () {
        return {
            sharingStore: useSharingStore(),
            currentUrl: "",
            currentIframeUrl: ""
        }
    },
    setup: function () {
        return {};
    },
    components: {},
    mounted: function () {
        const encryptStr = this.sharingStore.getEncryptCurrentProjectSharing()
        this.currentUrl = window.location.href + `&sharing=${encryptStr}`
        this.currentIframeUrl = `<iframe src="${this.currentUrl}" frameborder="0" width="100%" height="600"></iframe>`
    },
    methods: {
        toggleShareModal: function () {
            this.$emit('toggleShareObjectModal')
        },
        copyShareUrl: function (url) {
            navigator.clipboard
                .writeText(url)
                .then(() => {
                    successToast("Đã sao chép đường dẫn");
                })
                .catch((error) => {
                    errorToast("Lỗi khi sao chép: ", error);
                });
        }
    },
};
</script>

<template>
    <div class="modal fade bs-example-modal-lg show" tabindex="-1" aria-labelledby="myLargeModalLabel"
        style="display: block;" aria-modal="true" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="myLargeModalLabel">Chia sẻ thông tin dự án</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        @click="toggleShareModal()"></button>
                </div>
                <div class="modal-body">
                    <ul class="nav nav-tabs mb-3" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" data-bs-toggle="tab" href="#shareUrlObject" role="presentation">
                                Đường dẫn
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="tab" href="#shareIframeObject" role="tab"
                                aria-selected="false">
                                Mã nhúng
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="tab" href="#shareSocialMedia" role="tab"
                                aria-selected="false">
                                Mạng xã hội
                            </a>
                        </li>

                    </ul>
                    <!-- Tab panes -->
                    <div class="tab-content  text-muted">
                        <div class="tab-pane active show" id="shareUrlObject" role="tabpanel">
                            <input type="text" class="form-control" v-model="currentUrl" readonly
                                @click="copyShareUrl(currentUrl)">
                            <iframe style='pointer-events: none;' :src="currentUrl" frameborder="0" width="100%"
                                height="600"></iframe>
                        </div>
                        <div class="tab-pane" id="shareIframeObject" role="tabpanel">
                            <input type="text" class="form-control" v-model="currentIframeUrl" readonly
                                @click="copyShareUrl(currentIframeUrl)">
                            <iframe style='pointer-events: none;' :src="currentUrl" frameborder="0" width="100%"
                                height="600"></iframe>
                        </div>
                        <div class="tab-pane" id="shareSocialMedia" role="tabpanel">
                            <a  :href="`https://www.facebook.com/sharer/sharer.php?u=` + encodeURIComponent(currentUrl)"
                            target="_blank" type="button" class="btn btn-facebook btn-label waves-effect waves-light"><i class="mdi mdi-facebook label-icon align-middle fs-16 me-2"></i> Facebook</a>
                        </div>
                    </div>
                </div>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</template>

<style scoped>
.btn-facebook {
    color: white;
    background-color: #1877f2;
}
</style>