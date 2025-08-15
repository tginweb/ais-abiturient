export async function openPacketDialog(context, data) {
    this.$router.push({
        name: 'edu.ege:packet',
        params: {
            orderIds: data.ids
        }
    }).catch(()=>{})
}
