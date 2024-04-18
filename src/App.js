import React, { useState, useEffect } from "react";
import { Form, Input, Select, Checkbox, Button, Pagination } from "antd";
import axios from "axios";

const App = () => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("trip");
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(3);

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleTagChange = (checkedValues) => {
    setSelectedTags(checkedValues);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams();
    queryParams.set("q", keyword);
    queryParams.set("cat", category);
    selectedTags.forEach((tag, index) => {
      queryParams.append("tags[]", tag);
    });

    const newUrl = `${window.location.origin}/search?${queryParams.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }, [keyword, category, selectedTags]);

  const updateFormFromUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    setKeyword(urlParams.get("q") || "");

    // Cập nhật giá trị cho category từ tham số cat
    setCategory(urlParams.get("cat") || "trip");

    // Cập nhật giá trị cho selectedTags từ tham số tags
    const tagsParam = urlParams.getAll("tags[]");
    setSelectedTags(tagsParam || []);
  };

  // Sử dụng useEffect để gọi hàm updateFormFromUrlParams khi URL thay đổi
  useEffect(() => {
    updateFormFromUrlParams();
  }, []);

  const renderResults = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentResults = searchResults.slice(startIndex, endIndex);

    return currentResults.map((result, index) => (
      <div key={index} style={{ marginBottom: "20px" }}>
        <h3>{result.content}</h3>
        <div style={{ marginLeft: "20px" }}>
          <p>Category: {result.category}</p>
          <p>Tag: {result.tag}</p>
        </div>
      </div>
    ));
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const onFinish = async (values) => {
    try {
      const response = await axios.post("/search", {
        keyword: keyword,
        category: category,
        tags: selectedTags,
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="App">
      <h1>Search Info</h1>
      <Form
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="Từ khóa">
          <Input value={keyword} onChange={handleKeywordChange} />
        </Form.Item>
        <Form.Item label="Category">
          <Select value={category} onChange={handleCategoryChange}>
            <Select.Option value="trip">Trip</Select.Option>
            <Select.Option value="onboard">Onboard</Select.Option>
            <Select.Option value="onsite">Onsite</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Tag">
          <Checkbox.Group value={selectedTags} onChange={handleTagChange}>
            <Checkbox value="top_management">Top Management</Checkbox>
            <Checkbox value="supply_department">Supply Department</Checkbox>
            <Checkbox value="financial_department">
              Financial Department
            </Checkbox>
            <Checkbox value="desiogn_department">Design Department</Checkbox>
            <Checkbox value="marketing_department">
              Marketing Department
            </Checkbox>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginLeft: "130px" }}
          >
            Search
          </Button>
        </Form.Item>
      </Form>
      <div style={{ marginLeft: "130px" }}>
        <div>{renderResults()}</div>
        <Pagination
          current={currentPage}
          total={searchResults.length}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default App;
