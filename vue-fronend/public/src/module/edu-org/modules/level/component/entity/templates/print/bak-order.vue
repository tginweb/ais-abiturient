<template>

  <div class="print-tpl">

    <div class="WordSection1">

      <div style="float: left;">
        № {{vars.order.nid}}
      </div>


      <p align="right" style='text-align:right;clear: none;'>
        <b>Регистрационный номер</b> <u>________</u>
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
              <span>Фамилия:</span>&nbsp; <u>{{dataPersonal.lastName}}</u>
            </div>
            <div>
              <span>Имя</span>&nbsp; <u>{{dataPersonal.firstName}}</u>
            </div>
            <div>
              <span>Отчество</span>&nbsp; <u>{{dataPersonal.secondName}}</u>
            </div>
            <div>
              <span>Дата рождения:</span>&nbsp; <u>{{dataPersonal.birthday}}</u>
            </div>
            <div>
              <span>Гражданство:</span>&nbsp;<u>{{compCitizenship}}</u>
            </div>
          </td>
          <td valign="top">

            <div>
              <span>Документ, удостоверяющий личность:</span>&nbsp; <u>{{getTermByNid('abit.personDocType',
              dataPersonal.docType, 'name')}}</u>
            </div>

            <div>
              <span>Серия</span>&nbsp; <u>{{dataPersonal.doc.serial}}</u>&nbsp;
              <span>№</span>&nbsp; <u>{{dataPersonal.doc.number}}</u>&nbsp;
              <span>Код подразделения</span>&nbsp; <u>{{dataPersonal.doc.subcode}}</u>
            </div>

            <div>
              <span>Кем выдан:</span>&nbsp; <u>{{dataPersonal.doc.organization}}</u>
            </div>

            <div>
              <span>Дата выдачи:</span>&nbsp; <u>{{dataPersonal.doc.date}}</u>
            </div>

            <div>
              <span>Адрес регистрации по месту жительства:</span>&nbsp; <u>{{dataPersonal.addressReg.name}}</u>
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
          Контактная информация: телефон (основной) <u v-html="getValuePlaceholder(dataPersonal.phone, 19)">{{dataPersonal.phone}}</u>

          телефон (дополнительный) <u v-html="getValuePlaceholder(dataPersonal.phone2, 19)">{{dataPersonal.phone2}}</u>

          e-mail <u v-html="getValuePlaceholder(dataPersonal.email, 19)">{{dataPersonal.email}}</u>

          адрес фактического проживания <u>{{dataPersonal.addressEqual ? dataPersonal.addressReg.name : dataPersonal.addressLive.name}}</u>
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
                Основа <i>(бюджетная/коммерческая)</i>
              </span>
            </p>
          </td>
        </tr>

        <tr v-for="application of compApplications">
          <td align="center" valign="top">
            {{application.priority}}
          </td>
          <td align="center" valign="top">
            {{application.eduProgram.eduInstituteData.name}}
          </td>
          <td align="center" valign="top">
            {{application.eduProgram.abbr}} {{application.eduProgram.direct_name}}
          </td>
          <td align="center" valign="top">
            {{application.eduProgram.eduFormData.name}}
          </td>
          <td align="center" valign="top">

            {{$store.getters['abit/termsByNid'].eduOsnova[application.osnova].name.toLowerCase()}}

            <span v-if="application.osnova==1 && application.priemCat==2" class="">, &nbsp;{{$store.getters['abit/termsByNid'].eduPriemcat[application.priemCat].name.toLowerCase()}}</span>

          </td>
        </tr>
      </table>

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
          <td align="center"><p align="center">2016г</p></td>
          <td align="center"><p align="center">2017г</p></td>
          <td align="center"><p align="center">2018г</p></td>
          <td align="center"><p align="center">2019г</p></td>
          <td align="center"><p align="center">2020г</p></td>
          <td align="center"><p align="center">2016г</p></td>
          <td align="center"><p align="center">2017г</p></td>
          <td align="center"><p align="center">2018г</p></td>
          <td align="center"><p align="center">2019г</p></td>
          <td align="center"><p align="center">2020г</p></td>
        </tr>
        <tr>
          <td width="130">
            <p>
              Русский язык<strong></strong>
            </p>
          </td>
          <td align="center">{{subjectsVars.ege['s16_2016']}}</td>
          <td align="center">{{subjectsVars.ege['s16_2017']}}</td>
          <td align="center">{{subjectsVars.ege['s16_2018']}}</td>
          <td align="center">{{subjectsVars.ege['s16_2019']}}</td>
          <td align="center">{{subjectsVars.ege['s16_2020']}}</td>
          <td width="113">
            <p>
              Химия<strong></strong>
            </p>
          </td>
          <td align="center">{{subjectsVars.ege['s3_2016']}}</td>
          <td align="center">{{subjectsVars.ege['s3_2017']}}</td>
          <td align="center">{{subjectsVars.ege['s3_2018']}}</td>
          <td align="center">{{subjectsVars.ege['s3_2019']}}</td>
          <td align="center">{{subjectsVars.ege['s3_2020']}}</td>
        </tr>
        <tr>
          <td width="130">
            <p>
              Математика<strong></strong>
            </p>
          </td>
          <td align="center">{{subjectsVars.ege['s1_2016']}}</td>
          <td align="center">{{subjectsVars.ege['s1_2017']}}</td>
          <td align="center">{{subjectsVars.ege['s1_2018']}}</td>
          <td align="center">{{subjectsVars.ege['s1_2019']}}</td>
          <td align="center">{{subjectsVars.ege['s1_2020']}}</td>
          <td width="113">
            <p>
              Английский язык<strong></strong>
            </p>
          </td>
          <td align="center">{{subjectsVars.ege['s37_2016']}}</td>
          <td align="center">{{subjectsVars.ege['s37_2017']}}</td>
          <td align="center">{{subjectsVars.ege['s37_2018']}}</td>
          <td align="center">{{subjectsVars.ege['s37_2019']}}</td>
          <td align="center">{{subjectsVars.ege['s37_2020']}}</td>
        </tr>
        <tr>
          <td width="130">
            <p>
              Физика<strong></strong>
            </p>
          </td>
          <td align="center">{{subjectsVars.ege['s2_2016']}}</td>
          <td align="center">{{subjectsVars.ege['s2_2017']}}</td>
          <td align="center">{{subjectsVars.ege['s2_2018']}}</td>
          <td align="center">{{subjectsVars.ege['s2_2019']}}</td>
          <td align="center">{{subjectsVars.ege['s2_2020']}}</td>
          <td width="113">
            <p>
              Обществознание
            </p>
          </td>
          <td align="center">{{subjectsVars.ege['s18_2016']}}</td>
          <td align="center">{{subjectsVars.ege['s18_2017']}}</td>
          <td align="center">{{subjectsVars.ege['s18_2018']}}</td>
          <td align="center">{{subjectsVars.ege['s18_2019']}}</td>
          <td align="center">{{subjectsVars.ege['s18_2020']}}</td>
        </tr>
        <tr>
          <td width="130">
            <p>
              История<strong></strong>
            </p>
          </td>
          <td align="center">{{subjectsVars.ege['s20_2016']}}</td>
          <td align="center">{{subjectsVars.ege['s20_2017']}}</td>
          <td align="center">{{subjectsVars.ege['s20_2018']}}</td>
          <td align="center">{{subjectsVars.ege['s20_2019']}}</td>
          <td align="center">{{subjectsVars.ege['s20_2020']}}</td>
          <td width="113">
            <p>
              Информатика
            </p>
          </td>
          <td align="center">{{subjectsVars.ege['s19_2016']}}</td>
          <td align="center">{{subjectsVars.ege['s19_2017']}}</td>
          <td align="center">{{subjectsVars.ege['s19_2018']}}</td>
          <td align="center">{{subjectsVars.ege['s19_2019']}}</td>
          <td align="center">{{subjectsVars.ege['s19_2020']}}</td>
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

        <span>среднее общее образование</span>&nbsp;
        <span><el-tpl-checkbox :value="eduDocLevelSlug=='school'"></el-tpl-checkbox></span>&nbsp;

        <span>/ среднее профессиональное</span>&nbsp;
        <span><el-tpl-checkbox :value="eduDocLevelSlug=='spo'"></el-tpl-checkbox></span>&nbsp;

        <span>/ высшее: </span>

        бакалавриат <el-tpl-checkbox :value="eduDocLevelSlug=='high' && dataEducation.level==2"></el-tpl-checkbox> /
        специалитет <el-tpl-checkbox :value="eduDocLevelSlug=='high' && dataEducation.level==1"></el-tpl-checkbox> /
        магистратура <el-tpl-checkbox :value="eduDocLevelSlug=='high' && dataEducation.level==3"></el-tpl-checkbox> /
        "дипломированный специалист" <el-tpl-checkbox :value="false"></el-tpl-checkbox>,

        / окончил(а): <span><u>{{dataEducation.doc.organization}}</u></span>

      </p>

      <p>
        Аттестат
        <span>/диплом</span>
        <span>
          : серия <u>{{dataEducation.doc.serial}}</u>
          № <u>{{dataEducation.doc.number}}</u>
          Дата выдачи <u>{{dataEducation.doc.date}}</u>
        </span>
      </p>

      <p class="dense">
        Иностранный язык:
        английский <el-tpl-checkbox :value="compLanguagesByNid[1]"/>,&nbsp;
        немецкий <el-tpl-checkbox :value="compLanguagesByNid[2]"/>,&nbsp;
        французский <el-tpl-checkbox :value="compLanguagesByNid[3]"/>,&nbsp;
        другой <el-tpl-checkbox :value="compLanguagesByNid[10]"/> &nbsp;<u v-html="getValuePlaceholder(dataPersonal.languageCustom, 12)"></u>,&nbsp;&nbsp;
        не изучал(а) <el-tpl-checkbox :value="compLanguagesByNid[0]"/>.
      </p>

      <p>
        ИНН <u v-html="getValuePlaceholder(dataPersonal.inn, 20)"></u>
        &nbsp;&nbsp;СНИЛС <u v-html="getValuePlaceholder(dataPersonal.snils, 20)"></u>
      </p>

      <p>
        <span>
          С копией лицензии на осуществление образовательной деятельности, копией свидетельства о государственной
          аккредитации и приложением к ним по выбранному направлению подготовки (специальности), Уставом ИРНИ-ТУ,
          правилами приема, положением об апелляционной комиссии и процедуре апелляций по результатам всту-пительных
          испытаний, проводимых в ИРНИТУ, расписанием вступительных испытаний, информацией о предо-ставляемых поступающим
          особых правах и преимуществах при приеме на обучение  <b>ознакомлен(а)</b>
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
          При поступлении на бюджетную основу обучения (в рамках контрольных цифр)
          <b>по программам бакалавриата (специалитета)</b> <b>подтверждаю</b> отсутствие
          диплома бакалавра, диплома специалиста, диплома магистра
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
         С датой завершения приема заявлений о согласии на зачисление
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
            чем по 3 направлениям подготовки (специальностям) в ИРНИТУ
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
        На обработку, использование, распространение (в том числе передачу, обезличивание, блокирование,
        уничто-жение) моих персональных данных, содержащихся в настоящем заявлении и прилагаемых к нему
        документов с целью учета поступающих на обучение в соответствии с законом №152-ФЗ от 27.07.2006
        г. «О персональных данных», с Положением о персональных данных абитуриентов и обучающихся ФГБОУ
        ВО ИРНИТУ <b>согласен(а)</b>
      </p>

      <div class="quote offset-top-minus">
        <div class="line"></div>
        <div class="label">
          (подпись абитуриента)
        </div>
      </div>

      <p>
        На рассылку новостей и информации ФГБОУ ВО ИРНИТУ на эл. почту и на телефон <b>согласен(а)</b>
      </p>

      <div class="quote offset-top-minus">
        <div class="line"></div>
        <div class="label">
          (подпись абитуриента)
        </div>
      </div>


      <table border="0" >
        <tr>
          <td valign="top">

          </td>
          <td>
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

            <p class="dense"><span>Олимпиады школьников из перечня Министерства образования и науки РФ <el-tpl-checkbox :value="false"/>;</span></p>

            <p class="dense"><span>IV</span><span>этапа всеукраинских ученических олимпиад <el-tpl-checkbox :value="false"/></span></p>

            <p class="dense">
              <span>
              Являюсь членом сборных команд РФ, Украины, участвующих в международных олимпиадах по
              общеобразовательным предметам <el-tpl-checkbox :value="false"/>
              </span>
              <span>Вид и номер документа победителя (призера) _________________________________________________________</span>
            </p>
          </td>
        </tr>
        <tr>
          <td valign="top">
            <p>
              <el-tpl-checkbox :value="appsOsnovaKeys.quota"/>
            </p>
          </td>
          <td>
            <b><span>Право на прием на обучение за счет бюджетных ассигнований в пределах особой квоты</span></b>

            <p class="dense">
              <span>
                Документ, предоставляющий право на прием на обучение в пределах особой квоты:
              </span>
              <span>
                  <u>{{compQuotaDocs}}</u>
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

            <div class="quote offset-top-minus" style="margin-top: -30px;">
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
            <p class="dense"> <b><span>Заключен договор о целевом обучении</span></b> </p>

            <p class="dense">
              <span style="width: 100%;display: block;border-bottom: 1px solid #111111;">{{dataEntrance.targetOrganization}} {{dataEntrance.targetDogovor}}</span>
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
            <p class="dense"><b><span>Преимущественное право зачисления</span></b> </p>
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

      <table border="0" >
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
              Имею золотой значок, полученный за результаты сдачи норм ГТО № удостоверения
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
    computed: {
      compQuotaDocs() {
        return this.vars.order.anket.fields.benefits.quotes.map((item) => {

          let parts = [], docParts = [];

          if (item.quotaType) parts.push('категория ' + this.getTermByNid('abit.eduQuota', item.quotaType, 'name'))

          if (item.haveDoc) {
            if (item.doc.serial) docParts.push('серия ' + item.doc.serial)
            if (item.doc.number) docParts.push('номер ' + item.doc.number)
            if (item.doc.organization) docParts.push('выдан ' + item.doc.organization)
            if (item.doc.date) docParts.push(item.doc.date);

            parts.push('документ: ' + docParts.join(', '));
          }

          return parts.join(', ')
        }).join(', ')
      }
    }
  }
</script>


<style lang="scss" scoped>


</style>
