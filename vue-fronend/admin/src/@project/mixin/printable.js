const dayjs = require('dayjs')

export default {
  props: {
    vars: {}
  },
  data() {
    return {

    }
  },

  computed: {
    dayjs() {
      return dayjs
    },
    order() {
      return this.vars.order
    },
    compFamilyByNid() {
      return this.dataPersonal.family.reduce((map, o) => (map[o.familyType] = o, map), {});
    },

    compLanguagesByNid() {
      return this.dataPersonal.languages.reduce((map, id) => {
        map[id] = id
        return map
      }, {});
    },

    achievementsByNid() {
      return this.dataEntrance.achievements.reduce((map, o) => (map[o.achievementType] = o, map), {});
    },

    appsOsnovaKeys() {
      let res = {}

      this.compApplications.forEach((app) => {

        let key

        switch (app.csource) {
          case 1:
            key = 'budget';
            break;
          case 2:
            key = 'quota';
            break;
          case 3:
            key = 'commerce';
            break
          case 4:
            key = 'target';
            break
        }

        res[key] = true
      })
      return res
    },

    eduDocLevelSlug() {

      let docType = this.vars.order.anket.education.docType;

      if (docType == 1) {
        return 'school'
      } else if (docType == 2) {
        return 'school'
      } else if (docType == 3) {
        return 'high'
      } else if (docType == 4) {
        return 'spo'
      }
    },

    subjectsVars() {
      let res = {
        haveEge: false,
        haveInternal: false,
        ege: {},
        internal: []
      }

      this.order.tests.forEach((item) => {

        let name = this.$store.getters['edu_subject/byId'][item.csubject] && this.$store.getters['edu_subject/byId'][item.csubject].name

        if (item.status === 'internal') {
          res.internal.push(name);
          res.haveInternal = true
        } else {
          if (!item.abitEgeYear) {
            res.ege['s' + item.csubject + '_2023'] = (item.resultBall || item.abitEgeBall) || '+';
          } else {
            res.ege['s' + item.csubject + '_' + item.abitEgeYear] = (item.resultBall || item.abitEgeBall) || '+';
          }
          res.haveEge = true
        }

      })

      return res
    },

    dataPersonal() {
      return this.vars.order.anket.personal
    },

    dataEducation() {
      return this.vars.order.anket.education
    },

    dataEntrance() {
      return this.vars.order.anket.entrance
    },

    dataApplications() {

      const appGroupBudget = this.vars.order.appGroups.find(item => !!item.isBudget)
      const appGroupPaid = this.vars.order.appGroups.find(item => !item.isBudget)

      const appsBudget = appGroupBudget ? [...appGroupBudget.appsActive].sort( (a, b) => parseInt(a.priority) - parseInt(b.priority)) : []
      const appsPaid = appGroupPaid ? [...appGroupPaid.appsActive].sort( (a, b) => parseInt(a.priority) - parseInt(b.priority)) : []


      return [...appsBudget, ...appsPaid]
    },

    compCitizenship() {
      if (this.dataPersonal.citizenship == 'russia') {
        return 'РФ'
      } else {
        return this.$store.getters['edu_country/byId'][this.dataPersonal.citizenshipCountry] &&
            this.$store.getters['edu_country/byId'][this.dataPersonal.citizenshipCountry].name
      }
    },

    compApplication() {


      return this.compApplications[0]
    },

    compApplications() {


      return this.dataApplications.map((application) => {
        return {
          ...application,
        }
      })
    },

    compQuotaDocs() {
      return this.vars.order.anket.benefits.quotes.map((item) => {

        let parts = [], docParts = [];

        const quotaName = this.$store.getters['edu_quotaType/byId'][item.quotaType] && this.$store.getters['edu_quotaType/byId'][item.quotaType].name

        if (item.quotaType) parts.push('категория ' + quotaName)

        if (item.haveDoc) {
          if (item.doc.serial) docParts.push('серия ' + item.doc.serial)
          if (item.doc.number) docParts.push('номер ' + item.doc.number)
          if (item.doc.organization) docParts.push('выдан ' + item.doc.organization)
          if (item.doc.date) docParts.push(item.doc.date);

          parts.push('документ: ' + docParts.join(', '));
        }

        return parts.join(', ')
      }).join(', ')
    },

    personDocTypeName() {
      return this.$store.getters['edu_personDoctype/byId'][this.dataPersonal.docType]
          && this.$store.getters['edu_personDoctype/byId'][this.dataPersonal.docType].name
    },

    docEdu() {
      return this.vars.order.docs.find(doc => doc.type === 'education')
    },

    docPassport() {
      return this.vars.order.docs.find(doc => doc.type === 'passport')
    },

    age() {
      const date1 = dayjs()
      const years = parseInt(date1.diff(dayjs(this.dataPersonal.birthday, 'DD.MM.YYYY'), 'year'))
      return isNaN(years) ? 30 : years
    },

    majorPerson() {
      return this.age >= 18 ? this.dataPersonal : {
        addressReg: {},
        doc: {}
      }
    },

    minorPerson() {
      return this.age < 18 ? this.dataPersonal : {
        addressReg: {},
        doc: {}
      }
    },

    haveTestsEge() {
      return !!this.order.tests.find(test => test.passingType === 'ege')
    },

    haveTestsInternal() {
      return !!this.order.tests.find(test => test.passingType === 'internal')
    },

  },

  methods: {

    getValuePlaceholder(str, chars = 10) {

      str = str || ''

      if (!Array.isArray(str)) {
        str = [str]
      }

      str = str.filter(v => !!v).join(' ')

      const cnt = chars - (str || '').length

      return cnt > 0 ? str + ' ' + '&nbsp;'.repeat(cnt) : str
    }
  },

}
