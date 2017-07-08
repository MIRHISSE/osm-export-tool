import React, { Component } from "react";

import { Col, Row, Table, Button } from "react-bootstrap";
import { connect } from "react-redux";

import MapListView from "./MapListView";
import Paginator from "./Paginator";
import { formatDate } from "./utils";
import { getExports } from "../actions/exports";
import { zoomToExportRegion } from "../actions/hdx";

class ExportTable extends Component {
  render() {
    const { jobs, selectRegion } = this.props;

    return (
      <tbody>
        {jobs.map((job, i) => {
          return (
            <tr key={i}>
              <td>
                {/* TODO Link */}
                <a href={`#/exports/detail/${job.uid}`}>
                  {job.name}
                </a>
              </td>
              <td>
                {job.description}
              </td>
              <td>
                {job.project}
              </td>
              <td>
                {formatDate(job.created_at)}
              </td>
              <td>
                {job.user.username}
              </td>
              <td>
                <Button
                  title="Show on map"
                  onClick={() => selectRegion(job.simplified_geom.id)}
                >
                  <i className="fa fa-globe" />
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  }
}

export class ExportList extends Component {
  componentWillMount() {
    this.props.getExports();
  }

  render() {
    const { getExports, jobs, selectedFeatureId, selectRegion } = this.props;

    const features = {
      features: jobs.items.map(j => j.simplified_geom),
      type: "FeatureCollection"
    };
    return (
      <Row style={{ height: "100%" }}>
        <Col xs={6} style={{ height: "100%", overflowY: "scroll" }}>
          <div style={{ padding: "20px" }}>
            <h2 style={{ display: "inline" }}>Exports</h2>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Project</th>
                  <th>Created At</th>
                  <th>Owner</th>
                  <th />
                </tr>
              </thead>
              <ExportTable jobs={jobs.items} selectRegion={selectRegion} />
            </Table>
            <Paginator collection={jobs} getPage={getExports} />
          </div>
        </Col>
        <Col xs={6} style={{ height: "100%" }}>
          <MapListView
            features={features}
            selectedFeatureId={selectedFeatureId}
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => {
  return {
    jobs: state.jobs,
    // TODO NOT HDX
    selectedFeatureId: state.hdx.selectedExportRegion
  };
};

export default connect(mapStateToProps, {
  getExports,
  selectRegion: zoomToExportRegion
})(ExportList);
