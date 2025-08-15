<template>

  <div class="print-tpl">

    <p style="text-align: center; font-size: 19px;">
      <b>ИРКУТСКИЙ НАЦИОНАЛЬНЫЙ ИССЛЕДОВАТЕЛЬСКИЙ ТЕХНИЧЕСКИЙ УНИВЕРСИТЕТ</b>
    </p>

    <p style="margin-top: 10px; text-align: center;">
      Институт (факультет): {{order.institute ? order.institute.name : ''}}
    </p>

    <p style="text-align: center;">
      РАСПИСКА В ПОЛУЧЕНИИ ДОКУМЕНТОВ
    </p>

    <p>
      № ДЕЛА: {{order.regnum}}
    </p>

    <p>
      Получены от: {{order.fio}}
    </p>

    <p>
      следующие документы:
    </p>

    <ol>
      <li>
        Заявление
      </li>
      <li>

        Документ об образовании, выданный за  <u v-html="getValuePlaceholder(docEdu && docEdu.docSerial, 10)"/> № <u v-html="getValuePlaceholder(docEdu && docEdu.docNumber, 15)"/> от <u v-html="getValuePlaceholder(docEdu && docEdu.issueDate, 10)"/>

        ({{order.podldoc ? 'подлинник' : 'копия'}})

      </li>
      <li>
        Фото 3х4___шт.
      </li>
      <li>
        ____________________________________________________________
      </li>
      <li>
        ____________________________________________________________
      </li>

    </ol>

    <table border="0">
      <tr>
        <td style="width: 33%">
          Ответственный секретарь приёмной комиссии
        </td>
        <td style="width: 33%">
          {{dayjs().format('DD.MM.YYYY')}}
        </td>
        <td style="width: 33%">
          __________________
          (подпись)
        </td>
      </tr>
    </table>

    <br>
    <br>
    <br>
    <br>

    <p style="text-align: center;font-weight: bold;">
      В случае утери данной расписки немедленно заявить в приёмную комиссию
    </p>

    <p>
      Ваш идентификационный номер абитуриента № <b style="font-size: 18px;">{{ order.ratingId }}</b><br/>
      Идентификационный номер абитуриента, будет использован при публикации рейтингового обезличенного списка поступающих на программы высшего образования.<br/>
    </p>

    <p>
      Контактная информация приемной комиссии института (факультета): {{order.institute ? order.institute.name : ''}}:<br/>
      Телефон: {{order.institute ? order.institute.phone : ''}}<br/>
      Почта: {{order.institute ? order.institute.email : ''}}<br/>
    </p>

  </div>

</template>


<script>
import MPrintable from '@project/mixin/printable'

export default {
  mixins: [MPrintable],
  computed: {

  }
}
</script>


<style lang="sass" scoped>


</style>
