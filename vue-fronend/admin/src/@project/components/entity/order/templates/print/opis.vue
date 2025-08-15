<template>

  <div class="print-tpl">

    <p style="margin-bottom: 13px;text-align: center;">Иркутский национальный исследовательский технический университет</p>

    <p style="font-size: 20px;text-align: center;font-weight:bold;">ОПИСЬ ЛИЧНОГО ДЕЛА № {{ order.ratingId }}</p>

    <table border="1" style="margin-bottom: 30px;border-collapse: collapse;">
      <tr>
        <td>
          Обучающийся
        </td>
        <td>
          {{ order.fio }}
        </td>
      </tr>
      <tr>
        <td>
          Институт/факультет
        </td>
        <td>
          {{ order.institute ? order.institute.name : '' }}
        </td>
      </tr>
    </table>

    <table border="1" cellpadding="10" style="border-collapse: collapse;">
      <tr>
        <td style="text-align: center;">
          Номер
        </td>
        <td>
          Перечень документов
        </td>
        <td>
          Кол-во
        </td>
      </tr>
      <tr>
        <td style="text-align: center;">
          1
        </td>
        <td>
          Заявление обучающегося на зачисление
        </td>
        <td>
          1
        </td>
      </tr>
      <tr>
        <td style="text-align: center;">
          2
        </td>
        <td>
          Согласие абитуриента и обучающегося на обработку персональных данных ФГБОУ ВО "ИРНИТУ"
        </td>
        <td>
          2
        </td>
      </tr>
      <tr>
        <td style="text-align: center;">
          3
        </td>
        <td>
          Согласие на зачисление
        </td>
        <td>
          1
        </td>
      </tr>
      <tr>
        <td style="text-align: center;">
          4
        </td>
        <td>
          Документ об образовании (подлинник):
          {{ docEdu && docEdu.docTypeName }}
          <br/>
          {{ docEdu && docEdu.docSeries ? 'Cерия ' + docEdu.docSeries : '' }}
          {{ docEdu && docEdu.docNumber ? '№ ' + docEdu.docNumber : '' }}
          от {{ docEdu && docEdu.issueDate }}
        </td>
        <td>1</td>
      </tr>
      <tr>
        <td style="text-align: center;">
          5
        </td>
        <td>
          Копия документа об образовании
        </td>
        <td>1</td>
      </tr>
      <tr>
        <td style="text-align: center;">
          6
        </td>
        <td>
          Копия паспорта
        </td>
        <td>1</td>
      </tr>
      <tr>
        <td style="text-align: center;">
          7
        </td>
        <td>
          Результаты внутренних вступительных испытаний (экзаменационный лист)
        </td>
        <td>
          {{ haveTestsInternal ? '1' : '' }}
        </td>
      </tr>
      <tr>
        <td style="text-align: center;">
          8
        </td>
        <td>
          Справка о результатах единого государственного экзамена
        </td>
        <td>
          {{ haveTestsEge ? '1' : '' }}
        </td>
      </tr>
      <tr>
        <td style="text-align: center;">
          9
        </td>
        <td>
          Договор на оказании платных образовательных услуг
          в Иркутском национальном исследовательском техническом
          университете (Дополнительное соглашение):
          <br>
          № <u v-html="getValuePlaceholder('', 29)"></u>
          от "<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>" <u v-html="getValuePlaceholder('', 19)"></u> 2023г.

        </td>
        <td></td>
      </tr>
      <tr>
        <td style="text-align: center;">
          10
        </td>
        <td>

            Выписка приказа на зачисление
            № <u v-html="getValuePlaceholder('', 29)"></u>
            от "<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>" <u v-html="getValuePlaceholder('', 19)"></u> 2023г.

        </td>
        <td></td>
      </tr>
      <tr>
        <td style="text-align: center;">
          11
        </td>
        <td>
          Выписки приказов
        </td>
        <td></td>
      </tr>
      <tr>
        <td style="text-align: center;">
          12
        </td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td style="text-align: center;">
          13
        </td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td style="text-align: center;">
          14
        </td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td style="text-align: center;">
          15
        </td>
        <td>
          Учебная карточка
        </td>
        <td></td>
      </tr>
      <tr>
        <td style="text-align: center;">
          16
        </td>
        <td>
          Копия диплома выпускника
        </td>
        <td></td>
      </tr>
      <tr>
        <td style="text-align: center;">
          17
        </td>
        <td>
          Копия приложения к диплому выпускника
        </td>
        <td></td>
      </tr>
      <tr>
        <td style="text-align: center;">
          18
        </td>
        <td>
          Зачетная книжка
        </td>
        <td></td>
      </tr>
      <tr>
        <td style="text-align: center;">
          19
        </td>
        <td>
          Студенческий билет
        </td>
        <td></td>
      </tr>
      <tr>
        <td style="text-align: center;">
          20
        </td>
        <td>
          Протокол перезачета дисциплин базового учебного плана основной образовательной программы по направлению
            подготовки (специальности)
        </td>
        <td></td>
      </tr>
      <tr>
        <td style="text-align: center;">
          21
        </td>
        <td>
          Характеристика на выпускника
        </td>
        <td></td>
      </tr>
      <tr>
        <td style="text-align: center;">
          22
        </td>
        <td>
          Отзыв о работе обучающегося в период подготовки выпускной квалификационной работы
        </td>
        <td></td>
      </tr>
      <tr>
        <td style="text-align: center;">
          23
        </td>
        <td>
          Рецензия на выпускную квалификационную работу (только для выпускников магистратуры и специалитета)
        </td>
        <td></td>
      </tr>
    </table>

    <p style="margin-top:20px; margin-bottom: 20px;">
      Специалист студенческого отдела <u v-html="getValuePlaceholder('', 60)"></u>
    </p>

    <p>
      "<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>" <u v-html="getValuePlaceholder('', 19)"></u> 2023г.
    </p>

  </div>

</template>

<script>
import Base from './_base-order'

export default {
  extends: Base,
  computed: {}
}
</script>


<style lang="scss" scoped>


</style>
