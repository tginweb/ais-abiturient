<template>

    <div class="com">

        <div class="c-toolbar d-flex align-center">

            <div class="c-toolbar-buttons">

                <q-tabs :mandatory="false" :value="currentTabKey" hide-slider>

                    <q-tab
                            :to="`#${item.key}`"
                            @click="onTabClick(item)"
                            class="c-toolbar-button"
                            v-bind="getTabAttributes(item)"
                            v-for="item in tabs"
                            :name="item.key"
                            :key="item.key"
                    >

                        <q-icon :name="item.icon" />

                    </q-tab>

                </q-tabs>

            </div>

        </div>

        <div class="c-current-step" v-if="currentTabKey">

            <q-tab-panels v-model="currentTabKey">

                <q-tab-panel :name="'CONTACTS_PHONE'">

                    <div class="p-items">

                        <div class="p-item">

                            <span class="p-item-value">{{order.CONTACTS_PHONE}}</span>

                            <span class="p-item-edit">

                                <q-icon @click="$emit('stepNav', 'CONTACTS_PHONE')" class="ma-0" name="edit"></q-icon>

                            </span>

                        </div>

                    </div>

                </q-tab-panel>

                <q-tab-panel :name="'CONTACTS_NAME'">

                    <div class="p-items">

                        <div class="p-item">

                            <span class="p-item-value">{{order.CONTACTS_NAME}}</span>

                            <span class="p-item-edit">

                                <q-icon @click="$emit('stepNav', 'CONTACTS_NAME')" class="ma-0" name="edit"></q-icon>

                            </span>

                        </div>

                    </div>

                </q-tab-panel>

                <q-tab-panel :name="'DELIVERY_TYPE'">

                    <div class="p-items">

                        <div class="p-item">
                            <span class="p-item-value">{{params.deliveryTypes[order.DELIVERY_TYPE] ? params.deliveryTypes[order.DELIVERY_TYPE].label : ''}}</span>
                            <span class="p-item-edit">

                                <q-icon @click="$emit('stepNav', 'DELIVERY_TYPE')" class="ma-0" name="edit"></q-icon>

                            </span>
                        </div>

                    </div>

                </q-tab-panel>

                <q-tab-panel :name="'DELIVERY_ADDRESS'">

                    <div class="p-items">

                        <div class="p-item">
                            <span class="p-item-value">{{order.DELIVERY_ADDRESS}}</span>
                            <span class="p-item-edit">
                                <q-icon @click="$emit('stepNav', 'DELIVERY_ADDRESS')" class="ma-0">edit</q-icon>
                            </span>
                        </div>

                    </div>
                </q-tab-panel>


                <q-tab-panel :name="'DELIVERY_DEPT'">

                    <div class="p-items">

                        <div class="p-item">
                            <span class="p-item-value">{{params.deliveryDepts[order.DELIVERY_DEPT] ? params.deliveryDepts[order.DELIVERY_DEPT].label : ''}}</span>
                            <span class="p-item-edit">
                                <q-icon @click="$emit('stepNav', 'DELIVERY_DEPT')" class="ma-0">edit</q-icon>
                            </span>
                        </div>

                    </div>

                </q-tab-panel>

                <q-tab-panel :name="'DELIVERY_DATE'">

                    <div class="p-items">

                        <div class="p-item">
                            <span class="p-item-value">{{order.DATE}} {{order.TIME}}</span>
                            <span class="p-item-edit">
                                <q-icon @click="$emit('stepNav', 'DELIVERY_DATE')" class="ma-0">edit</q-icon>
                            </span>
                        </div>

                    </div>

                </q-tab-panel>

                <q-tab-panel :name="'PAYMENT_TYPE'">

                    <div class="p-items">

                        <div class="p-item">
                            <span class="p-item-value">{{params.paymentTypes[order.PAYMENT_TYPE] ? params.paymentTypes[order.PAYMENT_TYPE].label : ''}}</span>
                            <span class="p-item-edit">
                                <q-icon @click="$emit('stepNav', 'PAYMENT_TYPE')" class="ma-0">edit</q-icon>
                            </span>
                        </div>

                    </div>

                </q-tab-panel>


            </q-tab-panels>

        </div>

    </div>

</template>
<script>

    export default {
        components: {},
        props: {
            value: {},
            tabs: {}
        },
        data() {
            return {
                params: this.$store.state.sale.ds.params,
                order: this.value,
                currentTabKey: null,

            }
        },
        mounted() {


        },

        beforeDestroy() {


        },

        computed: {},

        methods: {

            onTabClick(item) {

                if (this.currentTabKey == item.key) {
                    this.currentTabKey = null;
                } else {
                    this.currentTabKey = item.key;
                }

            },

            getTabAttributes(item) {

                let result = {
                    class: {}
                };

                result['class']['status-default'] = true;

                return result;
            },

            stepEdit(step) {

                //this.onStepEdit(step);

            },

        },

        watch: {},


    }
</script>

<style lang="scss" scoped>

    .com {


    }

    .c-toolbar {

        .c-toolbar-title {
            margin-right: auto;
            font-size: 14px;
            font-weight: 600;
        }

        .c-toolbar-buttons {

            .c-toolbar-button {

                i {
                    font-size: 20px;
                    margin-top: 2px;
                }

                /deep/ {
                    a {
                        border: 2px solid #E6E6E6 !important;
                        color: #E6E6E6;
                        margin-left: 6px;
                        height: 35px;
                        width: 36px;
                        padding: 0;
                        text-align: center;

                        &.v-tabs__item--active {
                            border-color: #CE8714 !important;
                            color: #CE8714 !important;
                        }
                    }
                }

                &.status-finish {
                    a {
                        border-color: #73BB49 !important;
                        color: #73BB49 !important;
                    }
                }

                &.status-opened {
                    a {
                        border-color: #73BB49 !important;
                        color: #73BB49 !important;
                    }
                }
            }

        }

    }

    .c-current-step {

        margin: 0 0 0 0;

        .e-step-group-pane {
            ul {
                margin-top: -8px;
                margin-bottom: -8px;
            }
        }

    }

    .p-items {

        .p-item {
            -webkit-box-align: center;
            align-items: center;
            padding: 13px 20px;
            height: auto;
            line-height: 1.5em;
            font-size: 14px;
            display: flex;
            border: 1px solid #e9e9e9;

            .p-item-label {
                margin-right: 10px;
                display: inline-block;
                color: #999;
            }

            .p-item-value {
                font-weight: 600;
                font-size: 14px;
            }

            .p-item-edit {
                margin-left: auto;

                i {
                    color: #e9e9e9;
                }
            }

            &:not(:last-child) {
                margin: 0 0 12px 0;
            }
        }
    }

</style>
