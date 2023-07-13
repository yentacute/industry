<template>
    <section class="overview__container">
        <div class="overview__left">
            <img src="@/assets/images/inner-green.jpg" alt="">
        </div>

        <div class="overview__right">
            <span class="overview__right-small-title">
                Miễn thuế 02 năm ; Giảm 50% cho 04 năm tiếp theo
            </span>
            <h2 class="overview__right-title">
                Khu công nghiệp Sông Công II
            </h2>

            <div class="description">
                <li>
                    <font-awesome-icon icon="fa-solid fa-layer-group" />
                    <strong>Tổng diện tích: </strong><span>195ha</span>
                </li>
                <li>
                    <font-awesome-icon icon="fa-solid fa-location-dot" />
                    <strong>Địa chỉ: </strong><span>Việt Nam</span>
                </li>
                <li>
                    <font-awesome-icon icon="fa-solid fa-user-tie" />
                    <strong>Chủ đầu tư: </strong><span>SONGCONG - IP - TN</span>
                </li>
                <li>
                    <font-awesome-icon icon="fa-solid fa-business-time" />
                    <strong>Thời hạn vận hành: </strong><span> 09/1949 - Thời điểm thành lập: 09/1999</span>
                </li>
                <li>
                    <font-awesome-icon icon="fa-solid fa-money-bill-wave" />
                    <strong>Giá: </strong><span>20 USD/m2 Giá chưa bao gồm VAT</span>
                </li>
                <li>
                    <font-awesome-icon icon="fa-solid fa-building" />
                    <strong>Mật độ XD (%): </strong><span> 60 (%)</span>
                </li>
                <li>
                    <font-awesome-icon icon="fa-solid fa-percent" />
                    <strong>Tỷ lệ lấp đầy: </strong><span>Tỷ lệ lấp đầy: 100%</span>
                </li>
            </div>
        </div>
    </section>
</template>

<style lang="scss">
    .overview__container {
        padding: 0 30px;
        margin-bottom: 54px;

        @media(min-width:800px) {
            max-width: 1140px;
            margin: 0 auto;
            display: flex;
            padding: 120px 0;
            justify-content: space-between;
            align-items: center;
        }

        .overview__left,
        .overview__right {
            padding: 0 24px;
            
        }

        .overview__right {
            @media(max-width:800px) {
                padding: 0;
            }
        }

        .overview__left {

            @media(max-width:800px) {
                margin-bottom: 24px;
            }
            img {
                display: inline-block;
                width: 100%;
            }
        }

        .overview__right-small-title {
            font-weight: 600;
            margin-bottom: 16px;
            display: block;
            color: #44b73e;
        }

        .overview__right-title {
            font-size: 24px;
            font-weight: 600;
            line-height: calc(24px*1.333);
            margin-bottom: 16px;
            color: var(--vz-indigo);
        }

        li {
            list-style: none;
            padding: 12px 0;
            font-size: 16px;

            strong {
                color: var(--vz-indigo);
                margin-right: 5px;
            }

            svg {
                margin-right: 5px;
                width: 16px;
                height: 16px;
                path {
                    color: var(--vz-indigo);
                }
            }

            span {
                color: var(--vz-gray-700);
                font-weight: 500;
            }
        }
    }
</style>