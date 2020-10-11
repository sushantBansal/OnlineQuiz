import { Col, Row } from 'antd';
import Axios from 'axios';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import QueryString from 'query-string';
import React, { useEffect, useState } from 'react';
import OwlCarousel from 'react-owl-carousel';
import { useStore } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { default as jee, default as PlaceHolderImage } from '../../images/jee.png';
import { API_URL } from '../../utils/constants';

const SubCategoryContainer = props => {

    const store = useStore();
    const [token, setToken] = useState(store.getState().auth.token)
    const [subCategory, setSubCategory] = useState({})
    const [subCategories, setSubCategories] = useState([])
    const [quizes, setQuizes] = useState([])

    useEffect(() => {

        let isUnmounted = false;
        let id = props?.match?.params?.id;
        let query = QueryString.parse(props.location.search).q
        if (!isUnmounted) {

            store.subscribe(() => {
                setToken(store.getState().auth.token)
            })

            getSubCategories(query)
            if (id) {
                getSubCategoryById(id)
            }
        }

        return () => {
            isUnmounted = true;
        };
    }, [props.match.params.id, props.location.search])

    const getSubCategories = async (query) => {
        const response = await Axios.get(`${API_URL}/subCategories/search/${query}`)
        setSubCategories(response.data.data)
    }

    const getSubCategoryById = async id => {
        const response = await Axios.get(`${API_URL}/subCategories/${id}`)
        setSubCategory(response.data.data)
        response.data.data.subjects.map(subject => setQuizes(quizes => [...quizes, ...subject.quizes]))
    }

    const explore = id => {
        props.history.push(`/category/${id}`)
    }

    return (
        <Row>
            {
                subCategories.length === 0 &&
                <React.Fragment>
                    <Col className="cat-colm m-0" style={{
                        height: 200
                    }} xs={24}>
                        <img alt="Category image" src={subCategory.image ? subCategory.image : PlaceHolderImage} />
                        <div className="category-content">
                            <div className="category-inner">
                                <h3 className="cat__title text-white">{subCategory?.title}</h3>
                            </div>
                        </div>
                    </Col>
                    <Col xs={24}>
                        <div className="latestquiz">
                            <div className="cust-container">
                                <h2 className="text-center">Subjects</h2>
                                <Row className="latest-quiz-wrap" gutter={[16, 16]}>
                                    {
                                        <OwlCarousel
                                            className="owl-theme"
                                            loop="true"
                                            margin={10}
                                            items={3}
                                            responsiveClass="true"
                                            center="true"
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
                                                subCategory?.subjects?.map((subject, index) => {

                                                    return <div key="index" className="cat-colm">
                                                        <img alt="" src={subject?.image ? subject.image : jee} />
                                                        <div class="category-content">
                                                            <div class="category-inner">
                                                                <h3 class="cat__title"><a href="#">{subject.title}</a></h3>
                                                                <p class="cat__meta">{subject?.quizes?.length} Quizes</p>
                                                                <Link to={`/subject/${subject._id}`} class="theme-btn"
                                                                //  onClick={() => explore(subject._id)}
                                                                >Explore now</Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                )
                                            }
                                        </OwlCarousel>
                                    }
                                </Row>
                            </div>
                        </div>
                    </Col>
                </React.Fragment>
            }
        </Row>
    )
}


export default withRouter(SubCategoryContainer);