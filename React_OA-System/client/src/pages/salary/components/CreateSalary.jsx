import React from 'react'
import { Form, Input, DatePicker, message, Button, Row, Col, Select } from "antd"
import DropPopover from '../../../components/DropPopover'
import $http from "api";
import staticSalaryList from '../../../staticList/staticSalaryList';
import { salaryRules } from '../../../utils/rules';
import { mapData } from '../../../utils/mapData';
const { Option } = Select

const CreateSalary = ({ setDialogStatus, reloadPage }) => {
    const [form] = Form.useForm();

    const formMap = {
        input: (item) => <Input placeholder={item.initVal} />,
        popover: (item) => <Input
            readOnly={true}
            placeholder={item.initVal}
            addonAfter={
                <DropPopover
                    placeholderVal={item.labelVal}
                    interfaceName={item.url}
                    searchType={item.type}
                    getSelectItem={(obj) => {
                        form.setFieldsValue({
                            [item.itemName]: obj[item.type],
                            [item.itemName.split("V")[0]]: obj._id
                        })
                    }}
                />
            }
        />,
        date: () => <DatePicker placeholder='请选择入职时间' style={{ width: "100%" }} />,
        select: (item) => <Select placeholder={item.initVal}>
            {mapData[item.itemName].map((value, index) => <Option
                key={index}
                value={index}
            >
                {value}
            </Option>)}
        </Select>
    }

    // 表单提交
    const _onFinish = async (data) => {
        const { code, msg } = await $http.createSalary(data);
        if (!code) {
            message.success(msg);
            reloadPage();
            setDialogStatus(prev => prev = false);
            return
        }
        message.error(msg)
    }

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={_onFinish}
        >
            {staticSalaryList.map((item, index) => {
                return <Row key={index} justify={"space-between"}>
                    {item.map((childItem, childIndex) => {
                        return <Col key={childIndex} span={11}>
                            <Form.Item
                                label={childItem.labelTxt}
                                name={childItem.itemName}
                                required={true}
                                rules={salaryRules[childItem.itemName]}
                                style={childItem.style}
                            >
                                {childItem.renderType && formMap[childItem.renderType](childItem)}
                            </Form.Item>
                        </Col>
                    })}
                </Row>
            })}
            <Col span={24} style={{ textAlign: "right" }}>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        创建
                    </Button>
                </Form.Item>
            </Col>
        </Form>
    )
}

export default CreateSalary
