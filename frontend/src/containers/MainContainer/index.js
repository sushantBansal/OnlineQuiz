import React, { Component } from 'react'
import { Row, Col } from 'antd'
import SearhComponent from '../../components/Search'
import Quizes from '../../components/LatestQuizes'
import TrendingCategories from '../../components/TrendingCategories'

export default class MainContainer extends Component {
    render() {
        return (
            <>
                <SearhComponent />

                {/* <TrendingCategories />
            
                <Quizes title={"Popular Quizes"} id="popular_quiz" />
            
                <Quizes title={"Latest Quizes"} id="latest_quiz" /> */}
            </>
        )
    }
}
