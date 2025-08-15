import PrimeVue from 'primevue/config';

export function boot(ctx) {
    console.log('ddd')
    ctx.Vue.use(PrimeVue);

    require('primevue/resources/themes/nova/theme.css')
    require('primevue/resources/primevue.min.css')
    require('primeicons/primeicons.css')

}

export async function request(ctx) {

}



