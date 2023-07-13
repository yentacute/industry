<template>
    <div class="sidebar__wrap" id="sidebar-settings">
        <div class="sidebar__heading">
            <div class="sidebar__title">
                <i class="mdi mdi-cog-sync"></i>
                <span class="sidebar--title">SETTINGS</span>
            </div>
        </div>

        <div class="sidebar__settings">
            <div class="form-check form-switch form-check-inline d-block mb-4" dir="ltr">
                <input type="checkbox" class="form-check-input" id="inlineswitch1" @click="showGrid">
                <label for="inlineswitch1">Show widget</label>
            </div>
            <button type="button" class="btn btn-primary waves-effect waves-light d-inline-block mb-4" @click="amount = amount + 1">Tạo widget</button>
        </div>
    </div>
</template>

<script >
    /*import DragResizeComponent from '@/components/DragResizeComponent.vue'*/
    import {ref} from 'vue'

    // const { bus } = useEventsBus()

    export default{
        name: 'SettingsComponent',
        components: {
            /*'drag-resize' : DragResizeComponent*/
        },
        data() {
            return {
                footerHeight: null,
                screenWidth: null,
                screenHeight: null,
                step: null,
                canvasElementId: 'grid',
                canvas: null,
                x: 100,
                y: 100,
                h: 100,
                w: 100,
                active: false,
                amount: null
            }
        },

        created() {
            this.mountNum;
        },

        mounted() {
            this.canvas = this.$parent.$refs.canvas;
            this.amount = ref(0);
        },

        methods: {
            showGrid: function () {
                let selft = this;
                selft.step = 20;
                selft.footerHeight = document.querySelector('footer').offsetHeight;
                selft.screenWidth = window.innerWidth;
                selft.screenHeight = Math.floor(window.innerHeight -  this.footerHeight);
                selft.canvas.width = this.screenWidth;
                selft.canvas.height = this.screenHeight;
                selft.ctx = this.canvas.getContext('2d');
                selft.drawGrid(this.ctx, this.screenWidth, this.screenHeight, this.step);
            },

            drawGrid: function(ctx, w, h, step) {
                ctx.beginPath(); 
                for (var x=0;x<=w;x+=step) {
                        ctx.moveTo(x, 0);
                        ctx.lineTo(x, h);
                }

                // set the color of the line
                ctx.strokeStyle = '#2f333b';
        
                ctx.lineWidth = 1;
                // the stroke will actually paint the current path 
                ctx.stroke(); 
                // for the sake of the example 2nd path
                ctx.beginPath(); 
                for (var y=0;y<=h;y+=step) {
                        ctx.moveTo(0, y);
                        ctx.lineTo(w, y);
                }
                // set the color of the line
                ctx.strokeStyle = '#2f333b';
                // just for fun
                ctx.lineWidth = 1;
                // for your original question - you need to stroke only once
                ctx.stroke(); 
            },

            createWidget: function () {
                let self = this;
                let newEl = document.createElement('DraggableContainer');
                let vueDragResizeEl = document.createElement('Vue3DraggableResizable');
                document.querySelector('#layout-wrapper').appendChild(newEl);
            },
        },

        watch: {
            amount(newValue, oldValue) {
                if (newValue !== oldValue) {
                    bus.value.get('get-number', this.amount)
                }
            }
        }
    }

</script>

<style>

.draggable  {
  width: 200px;
  height: 200px;
  position: absolute;
  top: 100px;
  left: 100px;
  border: 1px solid #000;
  user-select: none;
  background-color: red;
  z-index: 9999;
}
</style>