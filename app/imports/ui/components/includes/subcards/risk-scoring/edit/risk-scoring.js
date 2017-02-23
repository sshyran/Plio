import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { inspire } from '/imports/api/helpers.js';
import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

const getTableData = instance => inspire(['tableData', 'guideHtml'], instance);

Template.Subcards_RiskScoring_Edit.viewmodel({
  mixin: ['riskScore', 'date', 'organization'],
  label: 'Risk scoring',
  scores: [],
  wrapperArgs() {
    const {
      label: _lText,
      scoresSorted: items
    } = inspire(['scoresSorted', 'label'], this);

    // On the top level sub card header it is the most recent Residual risk score that is displayed. If there is no Residual risk score entered yet, then the Inherent risk score is the one that is displayed.
    const primaryScore = this.getPrimaryScore(items);

    return {
      items,
      _lText,
      _rText: this.getScoreLabel(primaryScore),
      addText: 'Add a new risk score',
      renderContentOnInitial: !(items.length > 5),
      onAdd: this.onAdd.bind(this),
      getSubcardArgs: this.getSubcardArgs.bind(this)
    };
  },
  getSubcardArgs(doc) {
    return {
      doc,
      _id: doc._id,
      score: doc,
      _lText: `${this.getScoreTypeAdjLabel(doc.scoreTypeId)} - ${this.renderDate(doc.scoredAt)}`,
      _rText: this.getScoreLabel(doc),
      disabled: true,
      isNew: false,
      content: 'Subcards_RiskScore',
      insertFn: this.insert.bind(this),
      removeFn: this.remove.bind(this),
      ...getTableData(this)
    };
  },
  scoresSorted() {
    return this.sortScores(this.scores(), -1);
  },
  guideHtml() {
    const { rkScoringGuidelines } = Object.assign({}, this.organization());
    return rkScoringGuidelines;
  },
  tableData() {
    return {
      xHeading: 'Probability',
      yHeading: 'Impact',
      data: [
        {
          _id: 1,
          label: 'Catastrophic',
          rows: [45, 65, 91, 95, 100]
        },
        {
          _id: 2,
          label: 'Significant',
          rows: [35, 60, 75, 80, 85]
        },
        {
          _id: 3,
          label: 'Moderate',
          rows: [26, 51, 54, 59, 66]
        },
        {
          _id: 4,
          label: 'Minor',
          rows: [15, 26, 30, 36, 42]
        },
        {
          _id: 5,
          label: 'Limited',
          rows: [1, 8, 12, 16, 20]
        },
        {
          _id: 6,
          label: '',
          rows: ['V.Low', 'Low', 'Med', 'High', 'V.High'],
        }
      ]
    };
  },
  getScoreLabel({ value } = {}) {
    return value
      ? `<span>${this.getNameByScore(value)}</span>
         <span class="label impact-${this.getClassByScore(value)}">
           ${value}
         </span>`
      : '';
  },
  onAdd(add) {
    return add(
      'Subcard',
      {
        score: {
          scoredAt: new Date(),
          scoredBy: Meteor.userId()
        },
        content: 'Subcards_RiskScore',
        _lText: 'New risk score',
        isNew: false,
        insertFn: this.insert.bind(this),
        removeFn: this.remove.bind(this),
        ...getTableData(this)
      }
    );
  },
  onInsert() {},
  insert({ ...args }, cb) {
    return this.onInsert({ ...args }, cb);
  },
  onRemove() {},
  remove(viewmodel, cb = () => {}) {
    const { score = {} } = viewmodel.data();
    const { _id } = score;
    if (!_id) {
      viewmodel.destroy();
    } else {
      swal({
        title: 'Are you sure?',
        text: `Risk score will be removed.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Remove',
        closeOnConfirm: false
      }, () => {
        const showSuccess = (err) => {
          if (!err) {
            swal({
              title: 'Removed!',
              text: `Risk score was removed successfully.`,
              type: 'success',
              timer: ALERT_AUTOHIDE_TIME,
              showConfirmButton: false,
            });
          }
        };

        this.onRemove({ score }, showSuccess);
      });
    }
  }
});
