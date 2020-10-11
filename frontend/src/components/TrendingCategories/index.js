import React from 'react';
import OwlCarousel from 'react-owl-carousel';
import { Row, Col, Divider, Button } from 'antd';
import Title from 'antd/lib/skeleton/Title';
import { QuestionCircleOutlined, FieldTimeOutlined, UnlockOutlined, UserOutlined, HeartFilled, EyeFilled } from '@ant-design/icons'
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import * as $ from 'jquery';
import './index.scss';
import { injectIntl } from 'react-intl';
import { translate } from '../../i18n/translate'
const quizes = [
    {
        title: 'Defence Research and Development Organis...',
        count: 5,
        duration: 30,
        questions: 20, user: 'Site Administor'
    }, {
        title: 'Defence Research',
        count: 5,
        duration: 30,
        questions: 20, user: 'Site Administor'
    }, {
        title: 'Defence Research and Development Organis...',
        count: 5,
        duration: 30,
        questions: 20, user: 'Site Administor'
    }, {
        title: 'Defence Research and Development Organis...',
        count: 5,
        duration: 30,
        questions: 20, user: 'Site Administor'
    },
]

function TrendingCategories({ intl }) {
    return (
        <>

            <div style={{ backgroundColor: '#242936', padding: '5rem' }}>
                <div className="d-flex justify-content-between">
                    <h3 className="text-white mb-5" style={{ fontSize: '4.5rem', fontWeight: 600 }}>{
                        translate('trending_categories')
                    }</h3>
                    <Button className="text-white font-weight-bold" style={{
                        backgroundColor: '#3b3f4a',
                        fontSize: '2rem',
                        width: '15rem', height: '5rem'
                    }}>View All</Button>
                </div>
                <OwlCarousel
                    className="owl-theme"
                    loop="true"
                    margin={20}
                    items={3}
                    responsiveClass="true"
                    center="false"
                    dotsEach="true"
                    navText={["<div class='nav-btn prev-slide'></div>", "<div class='nav-btn next-slide'></div>"]}
                    responsive={{
                        0: {
                            items: 1,
                            dots: false,
                            center: true
                        },
                        600: {
                            items: 2,
                            center: true,
                            nav: true,
                            dots: false
                        },
                        1000: {
                            items: 4,
                            slideBy: 1,
                            center: false,
                            loop: true,
                            dots: true,
                            nav: true,
                            autoplay: true,
                            autoplayTimeout: 2000,
                            autoplayHoverPause: true,
                            lazyLoad: true,
                        },
                    }}
                >
                    {
                        quizes.map((quiz, index) =>
                            <Col xs={24} md={24} lg={24} className={`quiz-cards quiz-cards-${index} py-4`}>
                                <Row gutter={[16, 10]} justify="space-between">
                                    <Col xs={24}>
                                        <Row justify="space-between " align="middle">
                                            <Col xs={4}>
                                                <Row justify="space-between" align="middle">
                                                    <Col>
                                                        <EyeFilled style={{ color: '#fff', fontSize: '1.5rem' }} />
                                                    </Col>
                                                    <Col>
                                                        <p className="quiz-view-count">{quiz.count}</p>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs={2}>
                                                <HeartFilled style={{ color: '#fff', fontSize: '1.5rem' }} />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={24}>
                                        <Row justify="center">
                                            <Col style={{ height: '10rem' }} className="d-flex justify-content-center align-items-center" xs={24}>
                                                <p className="quiz-title text-center">
                                                    {quiz.title}
                                                </p>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col>
                                        <Row gutter={[16, 8]} justify="center">
                                            <Col xs={8}><Row gutter={[16]} justify="center" align="middle"
                                                style={{ textAlign: 'center' }}
                                            >
                                                <Col flex xs={24}>
                                                    <QuestionCircleOutlined style={{ color: '#fff', fontWeight: 600, fontSize: '3rem' }} />
                                                </Col>
                                                <Col xs={24}>
                                                    <h1 className="quiz-stats-number mt-2">{quiz.questions}</h1>
                                                </Col>
                                                <Col flex xs={24}>
                                                    <p className="quiz-stats-text mt-n2 d-flex align-align-self-center">
                                                        Questions
                                                        </p>
                                                </Col>
                                            </Row></Col>
                                            <Col xs={8}><Row gutter={[16]}
                                                style={{ textAlign: 'center' }}
                                                justify="center">
                                                <Col xs={24}> <FieldTimeOutlined style={{ color: '#fff', fontWeight: 600, fontSize: '3.4rem', marginTop: '-0.35rem' }} /></Col>
                                                <Col xs={24}>
                                                    <h1 className="quiz-stats-number mt-2">{quiz.duration}</h1>
                                                </Col>
                                                <Col xs={24}>
                                                    <p className="quiz-stats-text mt-n2">
                                                        Minute
                                                        </p>
                                                </Col>
                                            </Row></Col>
                                        </Row>
                                    </Col>
                                    <Col xs={24}>
                                        <Row style={{ position: 'relative', top: '1rem' }} justify="space-between" align="middle" >
                                            <Col xs={2}><UserOutlined style={{ color: '#fff', fontSize: '1.5rem' }} /></Col>
                                            <Col xs={20}>
                                                <p className="quiz-stats-text">{quiz.user}</p>
                                            </Col>
                                            <Col xs={2}><UnlockOutlined style={{ color: '#fff', fontSize: '1.5rem' }} /></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        )
                    }
                </OwlCarousel>
            </div>

        </>
    );
}

export default injectIntl(TrendingCategories)