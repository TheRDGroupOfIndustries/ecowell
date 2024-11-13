import React, { useContext, useEffect } from 'react';
import CommonLayout from '../../components/shop/common-layout';
import { Container, Row, Col, Media } from 'reactstrap';
import CartContext from '../../helpers/cart';
import { CurrencyContext } from '../../helpers/Currency/CurrencyContext';
import { useRouter } from 'next/navigation';

const OrderSuccess = () => {
    const cartContext = useContext(CartContext);
    const cartItems = cartContext.ordererdItems;
    const orderedDetails = cartContext.currentOrderDetails;
    const curContext = useContext(CurrencyContext);
    const symbol = curContext.state.symbol;
    const router = useRouter();

    useEffect(() => {
        console.log("ordered cartItems: ", cartItems);
        console.log("orderedDetails: ", orderedDetails);
    }, [cartItems, orderedDetails]);

    if (!cartItems || cartItems.length === 0) {
        router.push('/page/account/cart');
    }
    if (!orderedDetails) {
        router.push('/page/account/cart');
    }

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
    };

    return (
        <CommonLayout parent="home" title="order success">
            <section className="section-b-space light-layout white-1">
                <Container>
                    <Row>
                        <Col md="12">
                            <div className="success-text"><i className="fa fa-check-circle" aria-hidden="true"></i>
                                <h2>thank you</h2>
                                <p>Payment is successfully processed and your order is on the way</p>
                                <p>Transaction ID: {orderedDetails?.order_info?.order_id}</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="section-b-space">
                <Container>
                    <Row>
                        <Col lg="6">
                            <div className="product-order">
                                <h3>your order details</h3>

                                {cartItems.map((item, i) =>
                                    <Row className="product-order-detail" key={i}>
                                        <Col xs="3" >
                                            <Media src={item.variant.image_link} alt=""
                                                className="img-fluid blur-up lazyload" />
                                        </Col>
                                        <Col xs="3" className="order_detail">
                                            <div>
                                                <h4>product name</h4>
                                                <h5>{item.productId.title}</h5>
                                            </div>
                                        </Col>
                                        <Col xs="3" className="order_detail">
                                            <div>
                                                <h4>quantity</h4>
                                                <h5>{item.quantity}</h5>
                                            </div>
                                        </Col>
                                        <Col xs="3" className="order_detail">
                                            <div>
                                                <h4>price</h4>
                                                <h5>{symbol}{item.productId.price}</h5>
                                            </div>
                                        </Col>
                                    </Row>
                                )}

                                <div className="final-total mt-4">
                                    <h3>total <span>{symbol}{orderedDetails?.order_info?.total_price}</span></h3>
                                </div>
                            </div>
                        </Col>
                        <Col lg="6">
                            <Row className="order-success-sec">
                                <Col sm="6">
                                    <h4>summary</h4>
                                    <ul className="order-detail">
                                        <li>order ID: {orderedDetails?.order_info?.order_id}</li>
                                        <li>Order Date: {formatDate(orderedDetails?.order_info?.order_date)}</li>
                                        <li>Order Total: {symbol}{orderedDetails?.order_info?.total_price}</li>
                                    </ul>
                                </Col>
                                <Col sm="6">
                                    <h4>shipping address</h4>
                                    <ul className="order-detail">
                                        <li>{orderedDetails?.order_info?.first_name} {orderedDetails?.order_info?.last_name}</li>
                                        <li>{orderedDetails?.order_info?.address}</li>
                                        <li>{orderedDetails?.order_info?.city}, {orderedDetails?.order_info?.state}</li>
                                        <li>{orderedDetails?.order_info?.country} - {orderedDetails?.order_info?.pincode}</li>
                                        <li>Contact No. {orderedDetails?.order_info?.phone}</li>
                                    </ul>
                                </Col>
                                <Col sm="12" className="payment-mode">
                                    <h4>payment method</h4>
                                    <p>Pay on Delivery (Cash/Card). Cash on delivery (COD) available. Card/Net banking
                                        acceptance subject to device availability.</p>
                                </Col>
                                <Col md="12">
                                    <div className="delivery-sec">
                                        <h3>expected date of delivery</h3>
                                        <h2>october 22, 2023</h2>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </section>
        </CommonLayout>
    )
}

export default OrderSuccess;