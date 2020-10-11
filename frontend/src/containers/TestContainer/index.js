import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col, Button, Radio, Checkbox, Tag, Progress, message, Alert, Result } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import Axios from 'axios';
import { API_URL } from '../../utils/constants';
import { logout } from '../../actions'
import { Statistic } from 'antd';
import { authHeader } from '../../utils/auth-header';
import { useStore, useDispatch } from 'react-redux';
import moment from 'moment';
import { useCountdown } from "use-moment-countdown";
import { getCountDownTime } from '../../utils/momet-calculation';
import './index.scss';


const { Countdown } = Statistic;

const answerStatus = {
    attempted: {
        backgroundColor: '#ffd591',
        color: '#000'
    },
    markedForReview: {
        backgroundColor: '#d3adf7',
        color: '#000'
    },
    notAnswered: {
        backgroundColor: '#c3c3c3',
        color: '#000'
    }
}



const TestContainer = (props) => {

    const timerRef = useRef(null);
    const dispatch = useDispatch();
    const [duration, setDuration] = useState(JSON.parse(localStorage.getItem('timer'))?.remaining);
    const [testStarted, setTestStarted] = useState(false);
    const [token] = useState(useStore().getState().auth.token);
    const [userId] = useState(useStore().getState().auth._id);
    const [role] = useState(useStore().getState().auth.role);

    const [quiz, setQuiz] = React.useState({
    })
    const [test, setTest] = useState(null);
    const [result, setResult] = useState(null);
    const [showScore, setShowScore] = useState(false);

    const [questions, setQuestions] = useState([])
    const [currentQuestion, setCurrentQuestion] = useState(questions[0]);
    const [count, setCount] = useState(0);
    const [deadline, setDeadline] = useState(Date.now() + 10 * 60 * 1000);
    const [_usertest, setUserTest] = useState(null)

    useEffect(() => {
        let _userTest = localStorage.getItem('usertest') ? JSON.parse(localStorage?.getItem('usertest')) : null
        setUserTest(_userTest)
        let _quiz = localStorage.getItem('quiz') ? JSON.parse(localStorage?.getItem('quiz')) : null
        //    setDuration(_quiz.duration)
        setQuiz(_quiz)

        let isUnmounted = false;

        let id = props?.match?.params?.id;

        let _test;

        if (!isUnmounted && id) {

            (async () => {
                if (!test) {
                    await getQuizById(id);

                } else {
                    setDeadline(Date.now() + _quiz?.duration * 60 * 1000)
                    setQuestions(test?.response)
                    setCurrentQuestion(test?.response[count])
                }
                _test = await getTestByUserIdAndQuizId(userId, id)

            })()

        }

        // window.onbeforeunload = async (e) => {


        //     localStorage.setItem('timer', JSON.stringify({
        //         remaining: duration
        //     }))
        // }

        console.log(_test, timerRef)

        // window.onbeforeunload = async (e) => {
        //     clearInterval(timerRef.current)
        //     localStorage.setItem('timer', JSON.stringify({
        //         remaining: duration
        //     }))
        // }

        return () => {
            clearInterval(timerRef.current)
            localStorage.setItem('timer', JSON.stringify({
                remaining: duration
            }))
            isUnmounted = true


        }
    }, [props.match.params.id])



    const getQuizById = async (id) => {
        console.log('Calling gqt quiz by id')
        const response = await Axios.get(`${API_URL}/quizes/${id}`);
        setQuiz({
            ...quiz,
            ...response.data.data
        })




        setQuestions(response.data.data.questions)
        setCurrentQuestion(response.data.data.questions[count])
    }

    const getTestByUserId = async () => {
        const response = await Axios.get(`${API_URL}/users/${userId}/tests`, authHeader(token));
        setTest({
            ...response.data.data[0]
        })
    }

    const getTestByUserIdAndQuizId = async (userId, quizId) => {
        const response = await Axios.get(`${API_URL}/tests/${userId}/${quizId}`, authHeader(token));
        setTest({
            ...response.data.data
        })

        if (response.data === null) {
            setDuration(quiz?.duration);
        }
        if (response.data.data?.response.length > 0) {

            setQuestions(response.data?.data?.response)
            setCurrentQuestion(response.data?.data?.response[count])
            if (response.data.data.remainingDuration > 0 && !response.data.data.completed) {
                setDuration(response.data.data.remainingDuration)
                return timer(response.data.data.remainingDuration);
            } else if (duration && duration > 0 && !response.data.data.completed) {
                timer(duration);
            }

        }
        // setDuration(response.data.data.remainingDuration);

        if (!response.data.data) {
            await createTest({
                quiz: quizId,
                response: questions,
                duration: quiz.duration
            })
        }

        if (response.data.data && response.data.data.completed) {
            message.warning('Already completed this test')
            setTestStarted(true)
            if (role === 'guest') {
                setTimeout(() => {
                    dispatch(logout({}))
                }, 1000);
            }
            clearInterval(timerRef.current)
        }
        return test;
    }

    const updateTestById = async (id, data) => {
        const response = await Axios.put(`${API_URL}/tests/${id}`, data, authHeader(token));
        setTest({
            ...response.data.data
        })
        return response
    }

    const createTest = async (data) => {
        console.log(data, quiz)
        const response = await Axios.post(`${API_URL}/tests`, data, authHeader(token));
        setTest({
            ...response.data.data
        })
    }




    const [next, setNext] = useState(true);
    const handleNext = () => {
        saveTest()
        setPrev(true)
        if (count < questions.length - 1) {
            setCurrentQuestion(questions[count + 1])
            return setCount(count + 1)
        }
        setNext(false);

    }


    const [prev, setPrev] = useState(false)
    const handlePrev = () => {
        saveTest()
        setNext(true)
        if (count > 0) {
            setCurrentQuestion(questions[count - 1])
            return setCount(count - 1)
        }
        setPrev(false);
    }

    const saveTest = useCallback(() => {
        if (!test) {
            createTest(questions)
        } else {
            updateTestById(test._id, { response: questions, remainingDuration: duration })
        }
        setUserTest(questions)
        setQuiz(quiz)
        localStorage.setItem('usertest', JSON.stringify(questions))
        localStorage.setItem('quiz', JSON.stringify(quiz))
    }, [test, duration, questions])

    const handleRadioChange = (e, id) => {

        const _question = [...questions];
        const index = _question.findIndex((question) => question._id === id)

        //  if (!_question[index].attempted) {
        let _currentQuestion = _question[index] = {
            ...questions[index],
            attempted: true,
            answered: e.target.value,
            markedForReview: false
        }
        setCurrentQuestion(_currentQuestion)
        setQuestions(_question)
        saveTest()
        //  }

    }

    const markForReview = (e, id) => {

        const _question = [...questions];
        const index = _question.findIndex((question) => question._id === id)

        //   if (!_question[index].attempted) {
        let _currentQuestion = _question[index] = {
            ...questions[index],
            markedForReview: e.target.checked,
            attempted: false,
            answered: null
        }

        setCurrentQuestion(_currentQuestion)
        setQuestions(_question)
        saveTest()
        //  }
    }

    const setActiveQuestion = idx => {
        setCount(idx)
        setCurrentQuestion(questions[idx])
    }

    // submitting test
    const handleSubmit = async () => {

        let score = 0;
        let computedResult = test?.response?.map((test, index) => {
            const result = test.questionChoices.find((choice, index) => index + 1 === test.answered)
            console.log({ result }, test.answered)
            if (result) {
                if (result.isCorrect) {
                    score++
                }
                return {
                    [index + 1]: {
                        correct: result?.isCorrect
                    }
                }
            }
        })

        console.log(computedResult, questions, {
            totalQuestion: computedResult.length,
            correct: score,
            score: `${score} out of ${computedResult.length}`,
            percentage: `${score / computedResult.length * 100} %`
        })

        const response = await updateTestById(test._id, {
            completed: true,
            result: {
                totalQuestion: computedResult.length,
                correct: score,
                score: `${score} out of ${computedResult.length}`,
                percentage: `${score / computedResult.length * 100}`
            }
        })
        console.log(response)

        if (response.data.data.completed) {
            clearInterval(timerRef.current)
        }
        setResult({
            ...response.data.data.result
        })

        dispatch(logout({}));

    }

    const timer = React.useCallback((d) => {
        setTestStarted(true)
        const _duration = moment.duration(d, 'm');
        const intervalId = setInterval(() => {
            _duration.subtract(1, "s");

            setDuration(_duration.asMinutes())
            const inMilliseconds = _duration.asMilliseconds();

            localStorage.setItem('timer', JSON.stringify({
                remaining: _duration.asMinutes()
            }))
            if (inMilliseconds !== 0) return;

            clearInterval(intervalId);
            saveTest()
            console.warn("Times up!");
        }, 1000);
        timerRef.current = intervalId;
    }, [test, quiz, duration])

    const startTest = () => {
        timer(duration)
        setTestStarted(true)
        saveTest()
    }


    // showing corrent and incorrect
    const showCorrectIncorrect = (currentQuestion, choice, index) => {
        return {
            width: '100%',
            color: choice.isCorrect ?
                'green' : (currentQuestion.attempted && !choice.isCorrect) ? currentQuestion.answered === index + 1 ? 'red' : !currentQuestion.attempted && !choice.isCorrect ? '#000'
                    : '#000' : '#000'
        }
    }

    const [reviewed, setReviewed] = useState(false);
    const handleReview = () => {
        setReviewed(prev => !prev)
    }

    useEffect(() => {
        console.log(test)
        let isUnmounted = false;
        if (!isUnmounted) {
            if (test && !test.completed) {
                console.log('Inside useeffect')
                window.onbeforeunload = async (e) => {

                    localStorage.setItem('timer', JSON.stringify({
                        remaining: duration
                    }))
                }
            }
        }
        return () => {
            isUnmounted = true;
        }


    }, [test && test._id])

    return (
        <>
            <Row gutter={[16, 16]}>
            </Row>
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24}>
                    {
                        test?.completed &&
                        <Alert
                            message={'Test Completed'}
                            type="warning"
                            closable
                        />
                    }
                </Col>
                <Col xs={24}>
                    {
                        test?.result && <><Col xs={24}>
                            <Row justify="center">
                                <Col><h3> Your Score Card</h3></Col>
                            </Row>
                            <Row className="d-flex flex-column align-items-center" gutter={16, 32} justify="center">

                                <Progress type="circle" percent={test?.result?.percentage} />
                                <h4 className=" mt-2">{test?.result?.score}</h4>

                            </Row>

                        </Col>
                            <Col className="d-flex justify-content-center" xs={24}>
                                <Button onClick={handleReview} type="primary">Review</Button>
                            </Col>
                        </>
                    }

                    {
                        reviewed && test?.response?.map(test => <>
                            <Row gutter={[4, 16]} justify="center">
                                <Col xs={20}>
                                    <h2>{test?.title}</h2>
                                </Col>
                            </Row>
                            <Row className="mb-4" gutter={[4, 16]} justify="center">
                                {
                                    test?.questionChoices?.map((choice, index) => {

                                        if (choice.isCorrect) {
                                            return <Col xs={10}><Alert style={{ width: '100%' }} message={choice.text} type="success" showIcon /></Col>
                                        }
                                        if ((currentQuestion.attempted && !choice.isCorrect) && currentQuestion.answered === index + 1) {
                                            return <Col xs={10}><Alert style={{ width: '100%' }} message={choice.text} type="error" showIcon /></Col>
                                        }
                                        return <Col xs={10}><Alert style={{ width: '100%' }} message={choice.text} /></Col>

                                    })
                                }

                                {/* <Radio.Group
                                    value={test?.answered}
                                    onChange={(e) => {
                                        // handleRadioChange(e, test._id)
                                    }}>
                                    {
                                        test?.questionChoices?.map((choice, index) => {

                                            return <Col xs={24} md={24} lg={24}>
                                                <Radio
                                                    style={{
                                                        color: choice.isCorrect ? 'green' : '#000',
                                                        ...showCorrectIncorrect(test, choice, index),
                                                    }
                                                    }
                                                    className="m-3" value={index + 1}>
                                                    {
                                                        choice.text
                                                    }
                                                </Radio>

                                            </Col>
                                        }
                                        )
                                    }
                                </Radio.Group> */}
                            </Row>
                        </>)
                    }

                    {
                        (test?.result && role === 'guest')
                        &&
                        <Row justify="center" align="bottom">
                            <Button>
                                <Link to="/register">
                                    Get Registered
                                </Link>
                            </Button>
                        </Row>
                    }
                </Col>
            </Row>

            {
                test && !test?.completed &&
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={16}>
                        <h2>
                            {
                                quiz?.title
                            }
                        </h2>
                    </Col>
                    <Col xs={24} md={8}>
                        <Row gutter={[16]} className="d-flex" align="middle">
                            {
                                (test?.remainingDuration && test?.remainingDuration > 0) ?
                                    <React.Fragment>
                                        <Col>
                                            <h3>Exam ends in: </h3>
                                        </Col>
                                        <Col>
                                            {
                                                getCountDownTime(duration)
                                            }

                                        </Col>
                                    </React.Fragment>
                                    : ''
                            }

                        </Row>
                    </Col>
                    <Col xs={24}>
                        <Row justify="center" align="middle">
                            {
                                (!testStarted && !test?.completed) && <button
                                    onClick={() => {
                                        startTest()
                                    }}
                                    size="large" className="start-test-btn"><span>Start Test </span></button>
                            }

                        </Row>
                    </Col>
                    {
                        testStarted &&
                        <React.Fragment>
                            <Col xs={24} md={16}>
                                {
                                    currentQuestion &&
                                    <>
                                        <Row>
                                            <Col xs={24}>
                                                <h2>{currentQuestion?.title}</h2>
                                            </Col>
                                        </Row>
                                        <Row>

                                            <Radio.Group
                                                value={currentQuestion?.answered}
                                                onChange={(e) => {
                                                    handleRadioChange(e, currentQuestion._id)
                                                }}>
                                                {
                                                    currentQuestion?.questionChoices?.map((choice, index) => {

                                                        return <Col xs={24} md={24} lg={24}>
                                                            <Radio className="m-3" value={index + 1}>

                                                                {
                                                                    choice.text
                                                                }
                                                            </Radio>

                                                        </Col>
                                                    }
                                                    )
                                                }
                                            </Radio.Group>
                                        </Row>
                                    </>
                                }
                            </Col>
                            <Col xs={24} md={8}>
                                <Row gutter={[4, 16]} justify="">

                                    <Tag color="orange">Answered</Tag>


                                    <Tag color="default">Not Answered</Tag>


                                    <Tag color="purple">Marked for review</Tag>


                                </Row>
                                <Row gutter={[4, 16]}>
                                    <Col xs={24} md={12} lg={12}>

                                        {
                                            questions.map((question, index) => {

                                                const { markedForReview, attempted } = question;
                                                if (markedForReview) {
                                                    return <Button onClick={() => setActiveQuestion(index)} style={{
                                                        border: currentQuestion?._id === question._id ? '1px solid #1890ff' : '',
                                                        ...answerStatus.markedForReview
                                                    }} size="middle" >{index + 1}</Button>
                                                } else if (attempted) {
                                                    return <Button onClick={() => setActiveQuestion(index)} style={{
                                                        border: currentQuestion?._id === question._id ? '1px solid #1890ff' : '',
                                                        ...answerStatus.attempted
                                                    }} size="middle" >{index + 1}</Button>
                                                } else {
                                                    return <Button onClick={() => setActiveQuestion(index)} style={{
                                                        border: currentQuestion?._id === question._id ? '1px solid #1890ff' : '',
                                                    }} size="middle" >{index + 1}</Button>
                                                }

                                            }
                                            )
                                        }

                                    </Col>

                                </Row>
                            </Col>
                            {
                                (!test?.completed) &&
                                <Col style={{
                                    backgroundColor: '#f2f4f5'
                                }}
                                    xs={24} md={24}>
                                    <Row gutter={[16, 16]}></Row>
                                    <Row className="mt-4" gutter={[16, 16]} className="bg-dark-gray">
                                        <Col xs={24} md={16}>
                                            <Row className="d-flex align-items-center" gutter={32}>
                                                <Col>
                                                    <Button disabled={!prev} onClick={handlePrev}>
                                                        Prev
                            </Button>
                                                </Col>
                                                <Col>
                                                    <Button type="secondary" disabled={!next || !testStarted} onClick={handleNext}>
                                                        Next
                       </Button>
                                                </Col>
                                                <Col>
                                                    <Checkbox checked={currentQuestion?.markedForReview} onChange={(e) => markForReview(e, currentQuestion._id)}>
                                                        Mark For Review
                                    </Checkbox>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <Button disabled={!testStarted} onClick={handleSubmit} type="primary">Submit</Button>
                                        </Col>
                                    </Row>
                                </Col>
                            }
                        </React.Fragment>
                    }

                </Row>
            }
            {
                (!test || !token) &&
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={
                        <Link to="/">
                            <Button type="primary">Back Home</Button>
                        </Link>
                    }
                />
            }
        </>
    );
}


export default withRouter(TestContainer)