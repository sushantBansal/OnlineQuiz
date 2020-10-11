import { DeleteFilled, ImportOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, message, Row, Select, Switch, Tooltip, Upload } from 'antd';
import Dragger from 'antd/lib/upload/Dragger';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../../../../utils/constants';
const { Option } = Select;

const _props = {
    action: 'https://run.mocky.io/v3/77303da6-66b6-4d0c-81c9-0bdacf0837ab',
    listType: 'picture',
    onChange: (file) => {
        console.log(file)
    },
    multiple: true,
};

const AddQuestionContainer = (props) => {

    const [state, setState] = useState({
        title: "Hello world",
        display: "",
        description: "",
        visible: false,
        questionChoices: [{
            text: '',
            isCorrect: false
        }]
    })

    useEffect(() => {
        let isUnmounted = false;
        if (!isUnmounted) {
            console.log(props)
            setState({
                ...props,
                ...props.data,
                quiz: props?.data?.quiz?._id,
                questionChoices: props?.data?.questionChoices ? props.data.questionChoices : state.questionChoices,
                quizes: props.quizes,
                visible: props.visible
            })
            // getCategories()
        }
        return () => {
            isUnmounted = true;
        }
    }, [props, props.data]);

    const getCategories = async () => {
        const response = await Axios.get(`${API_URL}/categories`)
        setState({ ...state, categories: response.data.data });
    }

    const addQuestion = async (data) => {
        try {
            const response = await Axios.post(`${API_URL}/quizes/${data.quiz}/questions`, data, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            })
            props.onClose()
            props.getQuestions()
        } catch (error) {
            message.error(error.response.data.error)
            props.onClose()
        }
    }

    const updateQuestion = async (data) => {
        try {
            const response = await Axios.put(`${API_URL}/questions/${state._id}`, data, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            })
            props.onClose()
            props.getQuestions()
            message.success('Record updated')
        } catch (error) {
            props.onClose()
            message.error(error.response.statusText)
        }
    }

    const handleAnswerChange = (e, idx) => {
        let _questionChoices = state.questionChoices;
        _questionChoices[idx] = {
            ...questionChoices[idx], text: e.target.value
        }
        setState({
            ...state,
            questionChoices: _questionChoices
        })
    }

    const handleSwitch = (e, idx) => {
        let _questionChoices = state.questionChoices;
        _questionChoices[idx] = {
            ...questionChoices[idx], isCorrect: e
        }

        let correctCount = _questionChoices.filter(choices => choices.isCorrect).length;
        console.log({ correctCount }, state)

        setState({
            ...state,
            questionChoices: _questionChoices,
            isMultipleChoice: correctCount < 2 ? false : true
        })
    }

    const removeQuestionChoices = (idx) => {
        let _questionChoices = state.questionChoices;
        if (_questionChoices.length > 1) {
            _questionChoices.splice(idx, 1)
        }
        setState({
            ...state,
            questionChoices: _questionChoices
        })
    }

    const addQuestionChoices = () => {
        let _questionChoices = state?.questionChoices ? state.questionChoices : [];
        //  if (_questionChoices.length > 1) {
        _questionChoices.unshift({ text: '', isCorrect: false })
        //   }
        setState({
            ...state,
            questionChoices: _questionChoices
        })
    }

    const handleFinish = data => {

        console.log(state)
        if (props.edit) {
            return updateQuestion({
                ...data,
                isMultipleChoice: state?.isMultipleChoice
            })
        } else {
            return addQuestion(data)
        }
    }
    const handleFieldsChange = data => {
        console.log(data)
    }

    const importQuestion = {
        name: 'file',
        action: `${API_URL}/quizes/import`,
        headers: {
            Authorization: `Bearer ${props.token}`,
        },
        beforeUpload: file => {
            if (file.type !== 'text/csv') {
                message.error(`${file.name} is not a csv file`);
            }
            return file.type === 'text/csv';
        },
        onChange(info) {
            console.log(info)
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} imported successfully`);
                props.getQuizes()
                props.onClose()
            } else if (info.file.status === 'error') {
                message.error(`${info.file.response.error}.`);
            }
        }
    }

    const { title, description, displayOnLeaderboard, quiz, questionChoices, isMultipleChoice, noOfQuestion, category, categories, quizes, isRandom, duration, instruction } = state;

    return (
        <Drawer
            title="Add new question"
            width={650}
            style={{
                maxWidth: '100%'
            }}
            onClose={props.onClose}
            visible={props.visible}
            bodyStyle={{ paddingBottom: 80 }}
            footer={
                <div
                    style={{
                        textAlign: 'right',
                        height: 30
                    }}
                >

                </div>
            }
        > <Form layout="vertical" hideRequiredMark={false}
            initialValues={{
                title: title,
                description: description,
                instruction: instruction,
                displayOnLeaderboard: displayOnLeaderboard,
                categories: categories,
                isRandom: isRandom,
                isMultipleChoice: isMultipleChoice,
                noOfQuestion: noOfQuestion,
                questionChoices: questionChoices,
                duration: duration,
                quiz: quiz
            }}
            onFinish={handleFinish}
            onFieldsChange={handleFieldsChange}
        >
                <Row gutter={[16, 32]}>
                    <Col xs={24}>
                        <Tooltip title="Import from csv">
                            <Upload
                                {...importQuestion}
                            >
                                <Button type="primary">
                                    <ImportOutlined />
                                </Button>
                            </Upload>
                        </Tooltip>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="title"
                            label="Title"
                            rules={[{ required: true, message: 'Please enter the title' }]}
                        >
                            <Input name="title"
                                size="large" placeholder="Please enter title" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="quiz"
                            label="Select Quiz"
                            rules={[{ required: true, message: 'Please choose' }]}
                        >
                            <Select
                                name="quiz"
                                size="large" placeholder="Select one">
                                {
                                    quizes && quizes.map(quiz =>
                                        <Option key={quiz._id} value={quiz._id}>{quiz.title}</Option>
                                    )
                                }

                            </Select>
                        </Form.Item>
                    </Col>
                    {/* <Col span={8}>
                        <Form.Item
                            name="isMultipleChoice"
                            label="Is MCQ's Question"
                            rules={[{ required: false, message: 'Please choose the type' }]}
                        >
                            <Select
                                disabled
                                name="isMultipleChoice"
                                size="large" placeholder="Select one">
                                <Option value={true}>Yes</Option>
                                <Option value={false}>No</Option>
                            </Select>
                        </Form.Item>
                    </Col> */}
                </Row>
                <Row gutter={[16]}>
                    <Col span={24}>
                        <Form.Item
                            name="questionChoices"
                            label="Question Choices"
                            rules={[{ required: true, message: 'Please enter no of question' }]}
                        >
                            <Row>
                                <Col xs={24} className="d-flex justify-align-content-start">
                                    <Button
                                        title="Add options"
                                        type="primary"
                                        size="large"
                                        onClick={addQuestionChoices}
                                        className="mt-1 d-flex justify-content-center align-items-center">
                                        Add options
                                    </Button>
                                </Col>
                            </Row>
                            {
                                questionChoices && questionChoices.map((choice, index) =>

                                    <Row align={"middle"} gutter={1, 48}>
                                        <Col xs={14}>
                                            <Input name={`${index}`}
                                                value={choice.text}
                                                onChange={(e) => handleAnswerChange(e, index)}
                                                size="large" placeholder="Please enter question" />
                                        </Col>
                                        <Col className="mt-4 ml-3" xs={6}>
                                            <Form.Item label="Is Correct">
                                                <Switch onChange={(e) => handleSwitch(e, index)} className="mt-n4" checked={choice.isCorrect} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={2}>
                                            <Button
                                                onClick={() => removeQuestionChoices(index)}
                                                title="Remove" size="large" className="d-flex align-items-center justify-content-center" type="primary" shape="circle">
                                                <DeleteFilled />
                                            </Button>
                                        </Col>
                                    </Row>

                                )
                            }

                        </Form.Item>
                    </Col>
                    <Col xs={8}>
                        <Form.Item>

                        </Form.Item>
                    </Col>
                </Row>

                {/* <Row gutter={16}>
                    <Col>
                        <Dragger {..._props

                        }
                            progress
                            method="post"

                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                                band files
                                </p>
                        </Dragger>
                    </Col>
                </Row> */}
                <Row style={{ bottom: 0, right: 10 }} className="position-absolute">
                    <Col>
                        <Form.Item className="mb-3">
                            <Button onClick={props.onClose} style={{ marginRight: 8 }}>
                                Cancel
                        </Button>
                            <Button type="primary" htmlType="submit">
                                {
                                    props.edit ? 'Update' : 'Submit'
                                }
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
}


export default AddQuestionContainer;