import React, { useEffect, useState } from 'react';
import { Accordion, Card, Row, Col } from 'react-bootstrap';
import { getAssetDetailsById } from '../../../_metronic/redux/dashboardCrud';
import { formatDates } from '../common';
import { toAbsoluteUrl } from '../../../_metronic/_helpers';
import './form.css';
import { fetchAssetDetailViewSection } from '../../modules/Dashboard/_redux/dashboardActions';
import { getAssetDetailViewSection } from '../../modules/Dashboard/_redux/dashboardCrud';

const SECTIONS = [
  {
    heading: "Asset Information",
    fields: [

      { name: 'Asset Category:', value: 'assetCategoryName' },
      { name: 'Asset Year:', value: 'asset_year' },
      { name: 'Date of Acquisition:', value: 'date_of_acquisition', isDate: false },
      { name: 'Assigned To:', value: 'assignedEmployeeName' },
      { name: 'Subsidiary:', value: 'subsidiaryName' },
    ]
  },
  {
    heading: "Additional Information",
    fields: [
      { name: 'Asset Model:', value: 'assetModelName' },
      { name: 'Asset Description:', value: 'description' },
      { name: 'Date of Expiry:', value: 'date_of_expiry', isDate: false },
      { name: 'Current Condition:', value: 'currentConditionName' },
      { name: 'Location:', value: 'locationName' },
    ]
  },
];

const AssetDetails = ({ assetId, panelMode }) => {
  const [data, setdata] = useState({});

  useEffect(() => {
    if (assetId) {
        
      getAssetDetailViewSection(assetId)
        .then((res) => {
          if (res?.data?.data) {
            const raw = res.data.data;
     
            setdata({
              ...raw,
              assetCategoryName: raw.AssetCategory?.formName,
              assetModelName: raw?.AssetModel?.name,
              subsidiaryName: raw?.Subsidiary?.name,
              assignedEmployeeName: raw?.AssignedEmployee?.name,
              locationName: raw?.Location?.formName,
              currentConditionName: raw?.CurrentCondition?.name,
            });
          }
        })
        .catch(() => {
          setdata({});
        });
    } else {
      setdata({});
    }
  }, [assetId]);

  return (
    <>
      {panelMode && (
        <Accordion defaultActiveKey="0" className=" ">
          <Card>
            <Accordion.Collapse eventKey="0">

              <Card.Body className='bg-tsecondary '>
                <div>
                  {Object.keys(data).length ? (
                    <Row>
                      {/* Asset Info */}
                      <Col md={5}>

                        <h6 className="font-bold mb-0 text-primary my-2">
                          Asset Information
                        </h6>
                     

                        {/* grid-cols-[max-content_1fr] + whitespace-nowrap on labels
                            taake "Asset Category:" jaisi labels do lines mein na tootein.
                            Ab har field hamesha show hoti hai, value na ho to "N/A" dikhta hai */}
                        <div className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-2 text-sm text-black mt-2">
                          {SECTIONS[0].fields.map((field, idx) => {
                            const fieldValue = data[field.value];

                            return (
                              <React.Fragment key={idx}>
                                <div className="font-medium whitespace-nowrap">{field.name}</div>
                                <div>
                                  {fieldValue
                                    ? (field.isDate ? formatDates(fieldValue) : fieldValue)
                                    : 'N/A'}
                                </div>
                              </React.Fragment>
                            );
                          })}
                        </div>

                      </Col>


                      <Col md={5}>
                        <h6 className="font-bold mb-0 text-primary my-2 ">
                          {/* Additional Information */}&nbsp;
                        </h6>
                        <div className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-2 text-sm text-black mt-2">
                          {SECTIONS[1].fields.map((field, idx) => {
                            const fieldValue = data[field.value];

                            return (
                              <React.Fragment key={idx}>
                                <div className="font-medium whitespace-nowrap">{field.name}</div>
                                <div className=''>
                                  {fieldValue
                                    ? (field.isDate ? formatDates(fieldValue) : fieldValue)
                                    : 'N/A'}
                                </div>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </Col>


                    </Row>
                  ) : (
                    <p>No asset data available</p>
                  )}
                </div>
              </Card.Body>


            </Accordion.Collapse>
          </Card>
        </Accordion >
      )}
    </>
  );
};

export default AssetDetails;
