import React, { useState, useEffect } from 'react';
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, message, Tooltip, Upload } from 'antd';
import { PlusOutlined, InboxOutlined, ImportOutlined } from '@ant-design/icons';
import Dragger from 'antd/lib/upload/Dragger';
import Axios from 'axios';
import { API_URL } from '../../../../utils/constants'
import { authHeader } from '../../../../utils/auth-header';
const NoImage = require('../../../../images/no-image.png');
const { Option } = Select;




const AddCategoryContainer = (props) => {

    const [state, setState] = useState({
        title: "",
        display: false,
        description: "",
        image: '',
        categories: [],
        visible: false
    })
    const [upload, setUpload] = useState(false);

    useEffect(() => {
        let unmount = false;

        if (!unmount) {
            setState({
                ...props,
                ...props.data,
                parentCategory: props.data?.parentCategory?._id,
                categories: props.categories,
                visible: props.visible
            })
        }

        return () => {
            unmount = true
        }
    }, [props.edit])

    const handleFinish = async (data) => {
        console.log(data)
        if (state.edit) {
            return updateCategory({
                ...data,
                image: state.image
            })
        }
        try {
            const response = await Axios.post(`${API_URL}/categories`, {
                ...data,
                image: state.image
            }, authHeader(props.token))
            props.onClose()
            props.getCategories()
        } catch (error) {
            message.error(error.response.data.error)
            props.onClose()
        }
    }

    const updateCategory = async (data) => {
        try {
            const response = await Axios.put(`${API_URL}/categories/${state._id}`, data, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            })
            props.onClose()
            props.getCategories()
            message.success('Record updated')
        } catch (error) {
            message.error(error.response.data.error)
        }
    }

    const handleFieldsChange = (data) => {
        console.log(data)
    }

    const csvUploadProps = {
        name: 'file',
        action: `${API_URL}/categories/import`,
        headers: authHeader(props.token).headers,
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
                props.getCategories()
                props.onClose()
            } else if (info.file.status === 'error') {
                message.error(`${info.file.response.error}.`);
            }
        }
    }

    const categoryUploadProps = {
        action: `${API_URL}/categories/photo`,
        headers: authHeader(props.token).headers,
        listType: 'picture',
        onChange(info) {
            console.log(info)
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} uploaded successfully`);
                setState({
                    ...state,
                    image: info.file.response.url
                })
            } else if (info.file.status === 'error') {
                message.error(`${info.file.response.error}.`);
            }
        },
        multiple: true,
    };

    const { title, description, display, categories, image, parentCategory } = state;
    return (
        <Drawer
            title={props.edit ? "Edit category" : "Add new category"}
            width={600}
            style={{
                maxWidth: '100%'
            }}
            onClose={props.onClose}
            visible={state.visible}
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
        > <Form layout="vertical" hideRequiredMark={true}
            initialValues={{
                title: title,
                description: description,
                display: display,
                categories: categories,
                parentCategory: parentCategory,
                image: image
            }}
            scrollToFirstError
            onFinish={handleFinish}
            onFieldsChange={handleFieldsChange}
        >

                <Row gutter={[16, 32]}>
                    <Col xs={24}>
                        <Tooltip title="Import from csv. Also copy category id from table for reference, add it to csv under parentCategory.">
                            <Upload

                                {...csvUploadProps}
                            >
                                <Button type="primary">
                                    <ImportOutlined />
                                </Button>
                            </Upload>
                        </Tooltip>
                    </Col>
                </Row>
                <Row gutter={16, 32}>
                    <Col span={12}>
                        <Form.Item
                            name="title"
                            label="Title"
                            rules={[{ required: true, message: 'Please enter the title' }]}
                        >
                            <Input size="large" placeholder="Please enter the title" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="display"
                            label="Display On Home"
                            rules={[{ required: true, message: 'Please choose the type' }]}
                        >
                            <Select
                                name="display"
                                size="large" placeholder="Display on Home">
                                <Option value={true}>Yes</Option>
                                <Option value={false}>No</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="parentCategory"
                            label="Parent Category"
                            rules={[{ required: false, message: 'Select parent category' }]}
                        >
                            <Select
                                name="category"
                                placeholder="Select Parent Category"
                                size="large" >
                                {
                                    categories && categories.map(category =>
                                        <Option value={category._id}>{category.title}</Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
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
                                size="large" rows={4} placeholder="Please enter the description" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <img style={{ width: '30%' }} src={!image ? NoImage : image} />
                    </Col>
                    <Col>
                        <Dragger {...categoryUploadProps
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


export default AddCategoryContainer;