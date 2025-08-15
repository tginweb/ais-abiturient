<template>

  <div class="print-tpl">

  </div>

</template>

<script>

  export default {
    props: {
      vars: {}
    },
    methods: {
      getValuePlaceholder(str, chars = 10, min) {
        if (min && str && (str.length < min)) return str + ' &nbsp;'.repeat(chars)
        return str || '&nbsp;'.repeat(chars)
      },
    },
    computed: {

      compFamilyByNid() {
        return this.dataPersonal.family.reduce((map, o) => (map[o.familyType] = o, map), {});
      },

      compLanguages() {
        return this.dataPersonal.languages.map((nid)=>{
          return this.$store.getters['abit/termsByNid'].eduLanguage[nid]
        });
      },

      compLanguagesByNid() {
        return this.compLanguages.reduce((map, o) => (map[o.nid] = o, map), {});
      },

      achievementsByNid() {
        return this.dataEntrance.achievements.reduce((map, o) => (map[o.achievementType] = o, map), {});
      },

      appsOsnovaKeys() {
        let res = {}
        this.compApplications.forEach((app)=>{
          res[this.$store.getters['abit/orderAppGetOsnovaFullkey'](app)] = app
        })
        return res
      },

      eduDocLevelSlug() {

        let docType = this.vars.order.anket.fields.education.docType;

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

        this.vars.order.anket.fields.entrance.subjects.forEach((item) => {

          let name = this.getTermByNid('abit.eduSubject', item.subject, 'name')

          if (item.status == 'internal') {
            res.internal.push(name);
            res.haveInternal = true
          }  else if (item.status == 'notready') {
            res.ege['s' + item.subject + '_2020'] = '+';
            res.haveEge = true
          } else {
            res.ege['s' + item.subject + '_' + (item.year || '2020')] = item.status == 'ready' ? item['score'] : '+';
            res.haveEge = true
          }

        })

        return res
      },

      dataPersonal() {
        return this.vars.order.anket.fields.personal
      },

      dataEducation() {
        return this.vars.order.anket.fields.education
      },

      dataEntrance() {
        return this.vars.order.anket.fields.entrance
      },

      dataApplications() {
        return this.vars.order.applications.fields.applications
      },

      compCitizenship() {
        if (this.dataPersonal.citizenship == 'russia') {
          return 'РФ'
        } else {
          return this.$store.getters['abit/termsByNid'].eduCountry[this.dataPersonal.citizenshipCountry].title
        }
      },

      compApplication() {
        return this.compApplications[0]
      },

      compApplications() {
        return this.vars.order.applications.fields.applications.map((application) => {
          return {
            ...application,
            eduProgram: this.$store.getters['abit/eduProgramsPreparedByNid'][application.eduProgramNid]
          }
        })
      },

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


<style lang="sass" scoped>


</style>
