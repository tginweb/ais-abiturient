<template>

  <div class="print-tpl">

    <div class="WordSection1">

      <div style="float: left;">
        № {{ order.ratingId }}
      </div>

      <p align="right" style='text-align:right;clear: none;'>
        <b>Регистрационный номер</b> &nbsp;<u>{{ order.regnum }}</u>
      </p>

      <p>
        <b>
          <span>
            Ректору федерального государственного бюджетного образовательного учреждения высшего образования
           «Иркутский национальный исследовательский технический университет»
          </span>
        </b>
      </p>

      <p align="right" style='text-align:right'>
        <span style='font-size: 11.0pt'>Россия, 664074, Иркутская область, г. Иркутск, ул. Лермонтова, 83</span>
      </p>

      <table border="1" cellpadding="0" cellspacing="0"
             class="" style='border-collapse:collapse;border:none;margin-bottom: 20px;'>
        <tr>
          <td style='width:35%;' valign="top">
            <div>
              <span>Фамилия:</span>&nbsp; <u>{{ dataPersonal.lastName }}</u>
            </div>
            <div>
              <span>Имя</span>&nbsp; <u>{{ dataPersonal.firstName }}</u>
            </div>
            <div>
              <span>Отчество</span>&nbsp; <u>{{ dataPersonal.secondName }}</u>
            </div>
            <div>
              <span>Дата рождения:</span>&nbsp; <u>{{ dataPersonal.birthday }}</u>
            </div>
            <div>
              <span>Гражданство:</span>&nbsp;<u>{{ compCitizenship }}</u>
            </div>
          </td>
          <td valign="top">

            <div>
              <span>Документ, удостоверяющий личность:</span>&nbsp; <u></u>
            </div>

            <div>
              <span>Серия</span>&nbsp; <u>{{ docPassport && docPassport.docSeries }}</u>&nbsp;
              <span>№</span>&nbsp; <u>{{ docPassport && docPassport.docNumber }}</u>&nbsp;
              <span>Код подразделения</span>&nbsp; <u>{{ docPassport && docPassport.fields['SubdivisionCode'] }}</u>
            </div>

            <div>
              <span>Кем выдан:</span>&nbsp; <u>{{ docPassport && docPassport.docOrg }}</u>
            </div>

            <div>
              <span>Дата выдачи:</span>&nbsp; <u>{{ docPassport && docPassport.issueDate }}</u>
            </div>

            <div>
              <span>Адрес регистрации по месту жительства:</span>&nbsp; <u>{{ dataPersonal.addressReg.name }}</u>
            </div>

            <div>Предыдущий документ удостоверяющий личность (при наличии):</div>

            <div>
              Серия <u v-html="getValuePlaceholder(dataPersonal.docEge.serial, 20)"></u>
              № <u v-html="getValuePlaceholder(dataPersonal.docEge.number, 20)"></u>
              Дата выда-чи <u v-html="getValuePlaceholder(dataPersonal.docEge.date, 20)"></u>
            </div>

          </td>
        </tr>
      </table>

      <p>
        <span>
          Контактная информация: телефон (основной) <u
            v-html="getValuePlaceholder(dataPersonal.phone, 19)">{{ dataPersonal.phone }}</u>

          телефон (дополнительный) <u
            v-html="getValuePlaceholder(dataPersonal.phone2, 19)">{{ dataPersonal.phone2 }}</u>

          e-mail <u v-html="getValuePlaceholder(dataPersonal.email, 19)">{{ dataPersonal.email }}</u>

          адрес фактического проживания <u>{{
            dataPersonal.addressEqual ? dataPersonal.addressReg.name : dataPersonal.addressLive.name
          }}</u>
        </span>
      </p>

      <p align="center" style='text-align:center;line-height:115%'>
        <b><span style=';line-height:115%'>ЗАЯВЛЕНИЕ</span></b>
      </p>

      <p class="ConsPlusNormal" style='text-align:justify;text-indent:27.0pt'>
        <span style=';font-family:"Times New Roman",serif'>
          Прошу организовать прием на обучение на различных условиях поступления по следующим направлениям:
        </span>
      </p>


      <div v-for="appGroup of vars.order.appGroups" :key="appGroup._id">

        <div style="font-size:16px;text-align: center; margin-bottom: 10px;font-weight: bold;">
          {{ appGroup.isBudget ? 'На бюджетную основу' : 'На коммерческую основу' }}
        </div>

        <table border="0" cellpadding="0" cellspacing="0" class="Table bordered" style="margin-bottom: 15px;">

          <tr>
            <td>
              <p align="center"><span>№ п /п</span></p>
            </td>
            <td>
              <p align="center"><span>Институт (факультет)</span></p>
            </td>
            <td>
              <p align="center"><span>Наименование направления<br>(специальности)</span></p>
            </td>
            <td>
              <p align="center">
                <span>Форма обучения</span><br>
                <i><span>(очная/очно-заочная/ заочная/заочно-дистанционная)</span></i>
              </p>
            </td>
            <td>
              <p align="center">
              <span>
                Основа
              </span>
              </p>
            </td>

          </tr>

          <tr v-for="(application, index) of [...appGroup.appsActive].sort( (a, b) => parseInt(a.priority) - parseInt(b.priority))">

            <td align="center" valign="top">
              {{ index + 1 }}
            </td>

            <td align="center" valign="top">

              {{
                $store.getters['edu_institute/byId'][application.competition.admission.cfac] && $store.getters['edu_institute/byId'][application.competition.admission.cfac].name
              }}
            </td>

            <td align="center" valign="top">
              {{ application.competition.admission.abbr }} {{ application.competition.admission.direct_name }}
            </td>

            <td align="center" valign="top">
              {{ application.competition.admission.fob.name }}
            </td>

            <td align="center" valign="top">

              {{ application.competition.source.name }}

              <div v-if="application.competition.celevOrgName" style="margin-top: 10px;">
                {{ 'Организация: ' + application.competition.celevOrgName }}
              </div>

            </td>

          </tr>
        </table>

      </div>

      <p>
        Прошу допустить меня к участию во вступительных испытаниях по следующим дисциплинам:
        <u v-html="getValuePlaceholder(subjectsVars.internal.join(', '), 80)"></u>
      </p>

      <p>
        проводимых вузом самостоятельно

        <el-tpl-checkbox :value="subjectsVars.haveInternal"></el-tpl-checkbox>

        и (или) зачесть в качестве вступительных испытаний следующие результаты ЕГЭ

        <el-tpl-checkbox :value="subjectsVars.haveEge"></el-tpl-checkbox>
      </p>

      <table border="1" cellpadding="0" cellspacing="0" width="748">
        <tbody>
        <tr>
          <td rowspan="2"><p align="center">Наименование предмета</p></td>
          <td colspan="5"><p align="center">Баллы</p></td>
          <td rowspan="2"><p align="center">Наименование предмета</p></td>
          <td colspan="5"><p align="center">Баллы</p></td>
        </tr>
        <tr>
          <td align="center"><p align="center">2019г</p></td>
          <td align="center"><p align="center">2020г</p></td>
          <td align="center"><p align="center">2021г</p></td>
          <td align="center"><p align="center">2022г</p></td>
          <td align="center"><p align="center">2023г</p></td>

          <td align="center"><p align="center">2019г</p></td>
          <td align="center"><p align="center">2020г</p></td>
          <td align="center"><p align="center">2021г</p></td>
          <td align="center"><p align="center">2022г</p></td>
          <td align="center"><p align="center">2023г</p></td>
        </tr>
        <tr>
          <td width="130">
            <p>
              Русский язык<strong></strong>
            </p>
          </td>
          <td align="center">{{ subjectsVars.ege['s16_2019'] }}</td>
          <td align="center">{{ subjectsVars.ege['s16_2020'] }}</td>
          <td align="center">{{ subjectsVars.ege['s16_2021'] }}</td>
          <td align="center">{{ subjectsVars.ege['s16_2022'] }}</td>
          <td align="center">{{ subjectsVars.ege['s16_2023'] }}</td>
          <td width="113">
            <p>
              Химия<strong></strong>
            </p>
          </td>
          <td align="center">{{ subjectsVars.ege['s3_2018'] }}</td>
          <td align="center">{{ subjectsVars.ege['s3_2019'] }}</td>
          <td align="center">{{ subjectsVars.ege['s3_2020'] }}</td>
          <td align="center">{{ subjectsVars.ege['s3_2021'] }}</td>
          <td align="center">{{ subjectsVars.ege['s3_2022'] }}</td>
        </tr>
        <tr>
          <td width="130">
            <p>
              Математика<strong></strong>
            </p>
          </td>
          <td align="center">{{ subjectsVars.ege['s1_2019'] }}</td>
          <td align="center">{{ subjectsVars.ege['s1_2020'] }}</td>
          <td align="center">{{ subjectsVars.ege['s1_2021'] }}</td>
          <td align="center">{{ subjectsVars.ege['s1_2022'] }}</td>
          <td align="center">{{ subjectsVars.ege['s1_2023'] }}</td>
          <td width="113">
            <p>
              Английский язык<strong></strong>
            </p>
          </td>
          <td align="center">{{ subjectsVars.ege['s37_2019'] }}</td>
          <td align="center">{{ subjectsVars.ege['s37_2020'] }}</td>
          <td align="center">{{ subjectsVars.ege['s37_2021'] }}</td>
          <td align="center">{{ subjectsVars.ege['s37_2022'] }}</td>
          <td align="center">{{ subjectsVars.ege['s37_2023'] }}</td>
        </tr>
        <tr>
          <td width="130">
            <p>
              Физика<strong></strong>
            </p>
          </td>
          <td align="center">{{ subjectsVars.ege['s2_2019'] }}</td>
          <td align="center">{{ subjectsVars.ege['s2_2020'] }}</td>
          <td align="center">{{ subjectsVars.ege['s2_2021'] }}</td>
          <td align="center">{{ subjectsVars.ege['s2_2022'] }}</td>
          <td align="center">{{ subjectsVars.ege['s2_2023'] }}</td>
          <td width="113">
            <p>
              Обществознание
            </p>
          </td>
          <td align="center">{{ subjectsVars.ege['s18_2019'] }}</td>
          <td align="center">{{ subjectsVars.ege['s18_2020'] }}</td>
          <td align="center">{{ subjectsVars.ege['s18_2021'] }}</td>
          <td align="center">{{ subjectsVars.ege['s18_2022'] }}</td>
          <td align="center">{{ subjectsVars.ege['s18_2023'] }}</td>
        </tr>
        <tr>
          <td width="130">
            <p>
              История<strong></strong>
            </p>
          </td>
          <td align="center">{{ subjectsVars.ege['s20_2019'] }}</td>
          <td align="center">{{ subjectsVars.ege['s20_2020'] }}</td>
          <td align="center">{{ subjectsVars.ege['s20_2021'] }}</td>
          <td align="center">{{ subjectsVars.ege['s20_2022'] }}</td>
          <td align="center">{{ subjectsVars.ege['s20_2023'] }}</td>


          <td width="113">
            <p>
              Информатика
            </p>
          </td>
          <td align="center">{{ subjectsVars.ege['s19_2019'] }}</td>
          <td align="center">{{ subjectsVars.ege['s19_2020'] }}</td>
          <td align="center">{{ subjectsVars.ege['s19_2021'] }}</td>
          <td align="center">{{ subjectsVars.ege['s19_2022'] }}</td>
          <td align="center">{{ subjectsVars.ege['s19_2023'] }}</td>
        </tr>
        <tr>
          <td width="130">
            <p>
              Биология<strong></strong>
            </p>
          </td>
          <td align="center">{{ subjectsVars.ege['s22_2019'] }}</td>
          <td align="center">{{ subjectsVars.ege['s22_2020'] }}</td>
          <td align="center">{{ subjectsVars.ege['s22_2021'] }}</td>
          <td align="center">{{ subjectsVars.ege['s22_2022'] }}</td>
          <td align="center">{{ subjectsVars.ege['s22_2023'] }}</td>

        </tr>
        </tbody>
      </table>


      <p class="dense">
        <span>
          Прошу создать специальные условия&nbsp; при проведении вступительных испытаний в связи с ограниченными возможностями здоровья, инвалидностью:
        </span>
      </p>

      <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 10px;">
        <tr>
          <td valign="top">
            <u v-html="getValuePlaceholder(dataEntrance.specialNeeds, 80)"></u>
          </td>
          <td valign="top">
            <div class="quote">
              <div class="line"></div>
              <div class="label">
                (подпись абитуриента)
              </div>
            </div>
          </td>
        </tr>
      </table>

      <p class="dense">

        <b><span>Сведения об образовании:</span></b>

        имею

        <span>среднее общее образование</span>&nbsp;<span><el-tpl-checkbox :value="false"></el-tpl-checkbox></span>&nbsp;

        <span>/ среднее профессиональное</span>&nbsp;<span><el-tpl-checkbox :value="false"></el-tpl-checkbox></span>&nbsp;

        <span>/ высшее: </span>

        бакалавриат
        <el-tpl-checkbox :value="false"></el-tpl-checkbox>
        /
        специалитет
        <el-tpl-checkbox :value="false"></el-tpl-checkbox>
        /
        магистратура
        <el-tpl-checkbox :value="false"></el-tpl-checkbox>
        /
        "дипломированный специалист"
        <el-tpl-checkbox :value="false"></el-tpl-checkbox>
        ,
        / окончил(а): <span><u>{{ docEdu && docEdu.docOrg }}</u></span>

      </p>

      <p>
        Аттестат
        <span>/диплом</span>
        <span>
          : серия <u>{{ docEdu && docEdu.docSeries }}</u>
          № <u>{{ docEdu && docEdu.docNumber }}</u>
          Дата выдачи <u>{{ docEdu && docEdu.issueDate }}</u>
        </span>
      </p>

      <p class="dense">
        Иностранный язык:
        английский
        <el-tpl-checkbox :value="compLanguagesByNid[1]"/>
        ,&nbsp;
        немецкий
        <el-tpl-checkbox :value="compLanguagesByNid[2]"/>
        ,&nbsp;
        французский
        <el-tpl-checkbox :value="compLanguagesByNid[3]"/>
        ,&nbsp;
        другой
        <el-tpl-checkbox :value="compLanguagesByNid[100]"/> &nbsp;<u
          v-html="getValuePlaceholder(dataPersonal.languageCustom, 12)"></u>,&nbsp;&nbsp;
        не изучал(а)
        <el-tpl-checkbox :value="compLanguagesByNid[0]"/>
        .
      </p>

      <p>
        ИНН <u v-html="getValuePlaceholder(dataPersonal.inn, 20)"></u>
        &nbsp;&nbsp;СНИЛС <u v-html="getValuePlaceholder(dataPersonal.snils, 20)"></u>
      </p>

      <p>
        <span>
          С копией лицензии на осуществление образовательной деятельности, копией свидетельства о государственной аккредитации и приложением к ним по выбранному направлению подготовки (специальности), Уставом ИРНИТУ, правилами приема, положением об апелляционной комиссии и процедуре апелляций по результатам вступительных испытаний, проводимых в ИРНИТУ, расписанием вступительных испытаний, информацией о предоставляемых поступающим особых правах и преимуществах при приеме на обучение
          <b>ознакомлен(а)</b>
        </span>
      </p>

      <div class="quote offset-top-minus">
        <div class="line"></div>
        <div class="label">
          (подпись абитуриента)
        </div>
      </div>

      <p>
        <span>
          Об ответственности за достоверность сведений, указанных в заявлении о приеме,
          за подлинность подаваемых документов <b>предупрежден(а)</b>
        </span>
      </p>

      <div class="quote offset-top-minus">
        <div class="line"></div>
        <div class="label">
          (подпись абитуриента)
        </div>
      </div>

      <p>
        <span>
          При поступлении на бюджетную основу обучения <b>по программам бакалавриата/специалитета подтверждаю</b> отсутствие диплома бакалавра, диплома специалиста, диплома магистра
        </span>
      </p>

      <div class="quote offset-top-minus">
        <div class="line"></div>
        <div class="label">
          (подпись абитуриента)
        </div>
      </div>

      <p>
        <span>
         С датой завершения приема  оригинала  документа об образовании ознакомлен(а)
        </span>
        <b><span>ознакомлен(а)</span></b>
      </p>

      <div class="quote offset-top-minus">
        <div class="line"></div>
        <div class="label">
          (подпись абитуриента)
        </div>
      </div>

      <p style='text-align:justify'>
        <b>
          <span>Подтверждаю</span>
        </b>
        <span>подачу заявления не более чем в 5 вузов (включая ИРНИТУ)</span>
      </p>

      <div class="quote offset-top-minus">
        <div class="line"></div>
        <div class="label">
          <span>(подпись абитуриента)</span>
        </div>
      </div>

      <p>
        <b><span>Подтверждаю</span></b>
        <span>
            одновременную подачу заявлений о приеме по результатам конкурса не более
            чем по 5 направлениям подготовки (специальностям) в ИРНИТУ
          </span>
      </p>

      <div class="quote offset-top-minus">
        <div class="line"></div>
        <div class="label">
          (подпись абитуриента)
        </div>
      </div>

      <p style='text-autospace:none'>
        С Порядком распределения обучающихся по профилям (специализациям)
        <span>ИРНИТУ ознакомлен:</span>
      </p>

      <div class="quote offset-top-minus">
        <div class="line"></div>
        <div class="label">
          (подпись абитуриента)
        </div>
      </div>

      <p>
        Потребность в предоставлении места для проживания в общежитии в период
        обучения
        <b>да</b>&nbsp;
        <el-tpl-checkbox :value="dataPersonal.needFlat"/> &nbsp;
        <b>нет</b>&nbsp;
        <el-tpl-checkbox :value="!dataPersonal.needFlat"/>
      </p>


      <p>
        На рассылку новостей и информации ФГБОУ ВО ИРНИТУ на эл. почту и на телефон <b>согласен(а)</b>
      </p>

      <div class="quote offset-top-minus">
        <div class="line"></div>
        <div class="label">
          (подпись абитуриента)
        </div>
      </div>


      <table border="0" cellpadding="4">
        <tr>

          <td colspan="2">
            <b>Наличие особых прав <u>при приеме на обучение по программам бакалавриата и специалитета</u>:</b>
          </td>
        </tr>
        <tr>
          <td valign="top">
            <p>
              <el-tpl-checkbox :value="false"/>
            </p>
          </td>
          <td>
            <b><span>Право на прием без вступительных испытаний</span></b>

            <p class="dense">
              Являюсь победителем <span><el-tpl-checkbox :value="false"/></span>, призером
              <el-tpl-checkbox :value="false"/>
              <span>&nbsp;заключительного этапа по общеобразовательному предмету____________:</span>
            </p>

            <p class="dense"><span>Всероссийской олимпиады школьников <el-tpl-checkbox :value="false"/>;</span></p>

            <p class="dense"><span>Олимпиады школьников из перечня Министерства образования и науки РФ <el-tpl-checkbox
                :value="false"/>;</span></p>

            <p class="dense"><span>Являюсь членом сборных команд РФ, участвующих в международных олимпиадах по общеобразовательным предметам  <el-tpl-checkbox
                :value="false"/>;</span></p>


          </td>
        </tr>
        <tr>
          <td valign="top">
            <p>
              <el-tpl-checkbox :value="appsOsnovaKeys.quota"/>
            </p>
          </td>
          <td>
            <b><span>Право на прием на обучение за счет бюджетных ассигнований в пределах особой квоты / спец.квоты</span></b>

            <p class="dense">
              <span>
                Документ, предоставляющий право на прием на обучение в пределах особой квоты / спец.квоты:
              </span>
              <span>
                  <u>{{ compQuotaDocs }}</u>
              </span>
            </p>

            <p class="dense">
              Подтверждаю подачу заявления о приеме на основании особого права (победитель/призер
              всероссийской олимпиады (п.24 Правил приема), олимпиады школьников (п.27 Правил приема))
              только в ИРНИТУ и на од-но направление
            </p>

            <p class="desktop">
              <u style="word-wrap: break-word; width:100%;"></u>
            </p>

            <div class="quote offset-top-minus">
              <div class="line"></div>
              <div class="label">
                (подпись абитуриента)
              </div>
            </div>

          </td>
        </tr>

        <tr>
          <td valign="top">
            <p>
              <el-tpl-checkbox :value="appsOsnovaKeys.target"/>
            </p>
          </td>
          <td>
            <p class="dense"><b><span>Заключен договор о целевом обучении</span></b></p>

            <p class="dense">
              <span style="width: 100%;display: block;border-bottom: 1px solid #111111;">
                {{dataEntrance.targetOrganization }} {{ dataEntrance.targetDogovor }} &nbsp;
              </span>
              (полное наименование организации (муниципального образования), номер договора о целевом обучении)
            </p>
          </td>
        </tr>

        <tr>
          <td valign="top">
            <p>
              <el-tpl-checkbox :value="false"/>
            </p>
          </td>
          <td>
            <p class="dense"><b><span>Преимущественное право зачисления</span></b></p>
            <p class="dense">Документ, предоставляющий преимущественное право:</p>
            <p>
              <span style="width: 100%;display: inline-block;border-bottom: 1px solid #111111;"></span>
            </p>
          </td>
        </tr>
      </table>

      <p>
        <b>Наличие индивидуальных достижений</b>
        да
        <el-tpl-checkbox :value="dataEntrance.achievements.length>0"/>
        /нет
        <el-tpl-checkbox :value="dataEntrance.achievements.length==0"/>
      </p>

      <table border="0" cellpadding="4">
        <tr>
          <td valign="top">
            <p>
              <el-tpl-checkbox :value="false"/>
            </p>
          </td>
          <td>
            <p>
              Являюсь чемпионом (призером) Олимпийских/Паралимпийских/Сурдлимпийских игр/ чемпионом
              мира (Европы)/победителем первенства мира (Европы) по видам спорта, включенным в программы
              Олимпийских /Паралимпийских/Сурдлимпийских игр
            </p>
          </td>
        </tr>
        <tr>
          <td valign="top">
            <p>
              <el-tpl-checkbox :value="achievementsByNid[2]"/>
            </p>
          </td>
          <td>
            <p>
              Имею золотой, серебряный или бронзовый значок, полученный за результаты сдачи норм ГТО № удостоверения
              <u v-html="getValuePlaceholder(achievementsByNid[2] ? achievementsByNid[2].doc.number : '', 10)"></u>
            </p>
          </td>
        </tr>
        <tr>
          <td valign="top">
            <p>
              <el-tpl-checkbox :value="achievementsByNid[1]"/>
            </p>
          </td>
          <td>
            <p>
              Наличие аттестата/ диплома об образовании с отличием или золотой/серебряной медали

            </p>
          </td>
        </tr>
        <tr>
          <td valign="top">
            <p>
              <el-tpl-checkbox :value="achievementsByNid[3]"/>
            </p>
          </td>
          <td>
            <p>
              Участие и (или) результаты участия поступающих в олимпиадах и иных интеллектуальных и (или)
              творческих конкурсах
            </p>
          </td>
        </tr>
        <tr>
          <td valign="top">
            <p>
              <el-tpl-checkbox :value="achievementsByNid[4]"/>
            </p>
          </td>
          <td>
            <p>
              Участие и (или) результаты участия поступающих в физкультурных мероприятиях и спортивных
              мероприя-тиях, являюсь кандидатом в мастера спорта/и мастером спорта России/мастером спорта
              России международ-ного класса/заслуженным мастером спорта России
            </p>
          </td>
        </tr>

        <tr>
          <td valign="top">
            <p>
              <el-tpl-checkbox/>
            </p>
          </td>
          <td>
            <p>
              Участие и (или) результаты участия поступающих в олимпиадах школьников (не используемые для получения
              особых прав и (или) особого преимущества при поступлении на обучение по конкретным условиям поступления)
              из перечня олимпиад школьников на 2020/21 учебный год (приказ Министерства науки и высшего образования
              Российской Федерации от 27.08.2020 № 1125).;
            </p>
          </td>
        </tr>

        <tr>
          <td valign="top">
            <p>
              <el-tpl-checkbox/>
            </p>
          </td>
          <td>
            <p>
              Участие и (или) результаты участия поступающих в мероприятиях, включенных в перечень, утвержденных
              приказом №715 от 11.12.2020г. Министерства просвещения Российской Федерации.
            </p>
          </td>
        </tr>

        <tr>
          <td valign="top">
            <p>
              <el-tpl-checkbox/>
            </p>
          </td>
          <td>
            <p>
              □ Участие и (или) результаты участия в олимпиадах школьников (не используемые для получения особых прав и
              (или) особого преимущества при поступлении на обучение по конкретным условиям поступления) и иных
              интеллектуальных и (или) творческих конкурсах, физкультурных мероприятиях и спортивных мероприятиях,
              проводимых в соответствии с частью 2 статьи 77 Федерального закона N 273-ФЗ в целях выявления и поддержки
              лиц, проявивших выдающиеся способности.
            </p>
          </td>
        </tr>


      </table>

      <div class="quote">
        <div class="line"></div>
        <div class="label">
          (подпись абитуриента)
        </div>
      </div>

      <table>
        <tr>
          <td>Лицо, ответственное за прием документов&nbsp;</td>
          <td>
            <br>
            <div class="quote">
              <div class="line"></div>
              <div class="label">
                (подпись)
              </div>
            </div>
          </td>
          <td>
            <br>
            <div class="quote">
              <div class="line"></div>
              <div class="label">
                (расшфровка)
              </div>
            </div>
          </td>
        </tr>
      </table>

    </div>

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
