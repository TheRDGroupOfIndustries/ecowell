import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const Paragraph = ({title, inner, line ,hrClass, headingName="Top Collections", subHeadingName="special offer", paragraph="This is paragraph"}) => {
    return (
        <>
            <div className={title}>
                <h4>{subHeadingName}</h4>
                <h2 className={inner}>{headingName}</h2>
                {
                    line ?
                        <div className="line"></div> : 
                    hrClass ?
                        <hr role="tournament6"></hr>
                    : ''
                }
            </div>
            <Container>
                <Row>
                    <Col lg="6" className="m-auto">
                        <div className="product-para">
                            <p className="text-center">{paragraph}</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Paragraph;