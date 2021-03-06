import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  changeFilter as addFilter,
  toggleExpandSlice,
} from '../actions/dashboardState';
import { refreshChart } from '../../chart/chartAction';
import * as  saveModalActions from '../../explore/actions/saveModalActions';
import getFormDataWithExtraFilters from '../util/charts/getFormDataWithExtraFilters';
import { updateComponents } from '../actions/dashboardLayout';
import Chart from '../components/gridComponents/Chart';

const EMPTY_FILTERS = {};

function mapStateToProps(
  {
    charts: chartQueries,
    dashboardInfo,
    dashboardState,
    datasources,
    sliceEntities,
  },
  ownProps,
) {
  const { id } = ownProps;
  const chart = chartQueries[id] || {};
  const { filters } = dashboardState;

  return {
    chart,
    datasource:
      (chart && chart.form_data && datasources[chart.form_data.datasource]) ||
      {},
    slice: sliceEntities.slices[id],
    timeout: dashboardInfo.common.conf.SUPERSET_WEBSERVER_TIMEOUT,
    filters: filters[id] || EMPTY_FILTERS,
    // note: this method caches filters if possible to prevent render cascades
    formData: getFormDataWithExtraFilters({
      chart,
      dashboardMetadata: dashboardInfo.metadata,
      filters,
      sliceId: id,
    }),
    editMode: dashboardState.editMode,
    isExpanded: !!dashboardState.expandedSlices[id],
    supersetCanExplore: !!dashboardInfo.superset_can_explore,
    sliceCanEdit: !!dashboardInfo.slice_can_edit,
    dashboardInfo:dashboardInfo,
  };
}

function mapDispatchToProps(dispatch) {
  const action = Object.assign({}, {
    updateComponents,
    toggleExpandSlice,
    addFilter,
    refreshChart,
  }, saveModalActions );

  return bindActionCreators(
    action,
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chart);
