import React, { useState, useEffect } from 'react';
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, notification, message, Tooltip, Upload } from 'antd';
import { PlusOutlined, InboxOutlined, ImportOutlined } from '@ant-design/icons';
import Dragger from 'antd/lib/upload/Dragger';
import Axios from 'axios';
import { API_URL } from '../../../../utils/constants'
const { Option } = Select;


const _props = {
    action: 'https://run.mocky.io/v3/77303da6-66b6-4d0c-81c9-0bdacf0837ab',
    listType: 'picture',
    onChange: (file) => {
        console.log(file)
    },
    multiple: true,
};

const AddQuizContainer = (props) => {

    const [state, setState] = useState({
        title: "Hello world",
        display: "",
        description: "",
        visible: false
    })

    useEffect(() => {
        let isUnmounted = false;
        if (!isUnmounted) {
            console.log(props)
            setState({
                ...props,
                ...props.data,
                subject: props.data?.subject?._id,
                subjects: props.subjects,
                visible: props.visible
            })
            // getCategories()
        }
        return () => {
            isUnmounted = true;
        }
    }, [props]);

    const getCategories = async () => {
        const response = await Axios.get(`${API_URL}/subjects`)
        setState({ ...state, subjects: response.data.data });
    }

    const addQuiz = async (data) => {
        try {
            const response = await Axios.post(`${API_URL}/subjects/${data.subject}/quizes`, data, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            })
            props.onClose()
            props.getQuizes()
        } catch (error) {
            message.error(error.response.data.error)
            props.onClose()
        }
    }

    const updateQuiz = async (data) => {
        try {
            const response = await Axios.put(`${API_URL}/quizes/${state._id}`, data, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            })
            message.success('Record updated')
            props.onClose()
            props.getQuizes()

        } catch (error) {
            props.onClose()
            message.error(error.response.data.error)
        }
    }

    const handleFinish = data => {
        if (props.edit) {
            return updateQuiz(data)
        } else {
            return addQuiz(data)
        }
    }
    const handleFieldsChange = data => {
        console.log(data)
    }

    const importQuiz = {
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

    const { title, description, displayOnLeaderboard, questions, noOfQuestion, subject, subjects, isRandom, duration, instruction } = state;

    return (
        <Drawer
            title="Add new quiz"
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
                subjects: subjects,
                isRandom: isRandom,
                noOfQuestion: noOfQuestion,
                duration: duration,
                subject: subject,
                questions: questions
            }}
            onFinish={handleFinish}
            onFieldsChange={handleFieldsChange}
        >
                <Row gutter={[16, 32]}>
                    <Col xs={24}>
                        <Tooltip title="Import from csv. Also copy subject from table, add it to csv under catergory (optional).">
                            <Upload
                                {...importQuiz}
                            >
                                <Button type="primary">
                                    <ImportOutlined />
                                </Button>
                            </Upload>
                        </Tooltip>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="title"
                            label="Title"
                            rules={[{ required: true, message: 'Please enter the title' }]}
                        >
                            <Input name="title"
                                size="large" placeholder="Please enter title" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="displayOnLeaderboard"
                            label="Display On Home"
                            rules={[{ required: true, message: 'Please choose the type' }]}
                        >
                            <Select
                                name="diaplayOnLeaderboard"
                                size="large" placeholder="Display on Home or Menu">
                                <Option value={true}>Yes</Option>
                                <Option value={false}>No</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="isRandom"
                            label="Is Random Question"
                            rules={[{ required: true, message: 'Please choose the type' }]}
                        >
                            <Select
                                name="isRandom"
                                size="large" placeholder="Select one">
                                <Option value={true}>Yes</Option>
                                <Option value={false}>No</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="subject"
                            label="Select Subject"
                            rules={[{ required: true, message: 'Please choose' }]}
                        >
                            <Select
                                name="subject"
                                size="large" placeholder="Select one">
                                {
                                    subjects && subjects.map(cat =>
                                        <Option key={cat._id} value={cat._id}>{cat.title}</Option>
                                    )
                                }

                            </Select>
                        </Form.Item>
                    </Col>
                    {/* <Col span={8}>
                        <Form.Item
                            label="Numner of question"
                        >
                            <Input
                                readOnly
                                disabled
                                value={questions?.length}
                                size="large" />
                        </Form.Item>
                    </Col> */}
                    <Col span={8}>
                        <Form.Item
                            name="duration"
                            label="Duration in minute"
                            rules={[{ required: true, message: 'Please enter no of question' }]}
                        >
                            <Input name="duration"
                                size="large" placeholder="Duration in minutes" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[
                                {
                                    required: true,
                                    message: 'please enter description',
                                },
                            ]}
                        >
                            <Input.TextArea
                                name="description"
                                size="large" rows={4} placeholder="please enter url description" />
                        </Form.Item>
                    </Col>
                    <Col className="mt-1" span={24}>
                        <Form.Item
                            name="instruction"
                            label="Instruction"
                            rules={[
                                {
                                    required: true,
                                    message: 'please enter instruction',
                                },
                            ]}
                        >
                            <Input.TextArea
                                name="instruction"
                                size="large" rows={4} placeholder="please enter  instruction" />
                        </Form.Item>
                    </Col>
                    {/* <Col>
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
                    </Col> */}
                </Row>
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


export default AddQuizContainer;