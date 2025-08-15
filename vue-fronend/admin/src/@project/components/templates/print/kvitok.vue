<template>

  <div class="print-tpl" >

      <div style="text-align: center;font-size: 18px; font-weight: bold">
        Комплект документов
      </div>

      <div style="text-align: right;">
        Дата и время печати {{dayjs().format('DD.MM.YYYY HH:MM')}}
      </div>

      <div style="text-align: center;font-size: 24px; font-weight: bold;margin-top: 40px;">
        {{order.fio}}
      </div>

      <div style="text-align: center;font-size: 24px; font-weight: bold;margin-top: 30px;">
        Номер комплекта документов: {{order.ratingId}}
      </div>

      <div style="text-align: center;font-size: 20px; font-weight: bold;margin-top: 30px;">
        Дата рождения: {{order.anket.personal.birthday}}
      </div>

      <div style="margin-top: 40px;">
        Вы зарегистрированы в АИС "Университет".<br/>
        Вам необходимо обратиться в приёмную комиссию института, направление которого выбираете первым.<br/>
        Для формирования дела необходимо предоставить следующие документы:<br/>
        <ol>
          <li>Документ об образовании или его копия;</li>
          <li>Копия паспорта, основная страница и регистрация;</li>
          <li>Фото (обязательно, если предстоит сдавать вступительные экзамены);</li>
          <li>Для льготной категории поступающих документы, подтверждающие особые права.</li>
        </ol>
        Копии документов можно сделать в Деловом центре фойе университета.
      </div>

  </div>

</template>

<script>
import MPrintable from '@project/mixin/printable'

export default {
  extends: MPrintable,
  computed: {}
}
</script>


<style lang="scss" scoped>


</style>
