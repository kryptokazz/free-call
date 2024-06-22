import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function App() {
  const [fields, setFields] = useState([]);
  const [remembered, setRemembered] = useState({});
  const [percentages, setPercentages] = useState({});

  const [customField, setCustomField] = useState("");

  const handleCustomField = (e) => {
    setCustomField(e.target.value);
  }

  const addField = () => {
    const newField = {
      id: uuidv4(),
      question: "",
      answer: "",
      reading: "",
      comprehension: "",
      customFields: [] // Array to hold custom fields
    };
    setFields((prevFields) => [...prevFields, newField]);
    setRemembered((prev) => ({
      ...prev,
      [newField.id]: {
        question: false,
        answer: false,
        reading: false,
        comprehension: false,
        customFields: [] // Initialize custom fields remembered state
      }
    }));
  };

  const deleteField = (id) => {
    setFields((prevFields) => prevFields.filter((field) => field.id !== id));
  };

  const updateField = (id, fieldData) => {
    setFields((prevFields) =>
      prevFields.map((field) => (field.id === id ? { ...field, ...fieldData } : field))
    );
  };

  const toggleRemember = (id, fieldName) => {
    setRemembered((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [fieldName]: !prev[id][fieldName]
      }
    }));
  };

  const handleCustomFieldChange = (id, index, value) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id
          ? {
              ...field,
              customFields: [
                ...field.customFields.slice(0, index),
                { ...field.customFields[index], value },
                ...field.customFields.slice(index + 1)
              ]
            }
          : field
      )
    );
  };

  const addCustomField = (id, fieldType) => {
    if (!fieldType.trim() || fields.find(field => field.customFields.some(cf => cf.type === fieldType.trim()))) {
      alert("Please enter a valid and unique custom field type.");
      return;
    }

    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id
          ? {
              ...field,
              customFields: [
                ...field.customFields,
                { type: fieldType.trim(), value: "" }
              ]
            }
          : field
      )
    );
  };

  const removeCustomField = (id, index) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id
          ? {
              ...field,
              customFields: [
                ...field.customFields.slice(0, index),
                ...field.customFields.slice(index + 1)
              ]
            }
          : field
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fieldsValid = fields.every((field) => field.question.trim() !== "" && field.answer.trim() !== "");
    if (!fieldsValid) {
      alert("Please fill out question and answer for all fields.");
      return;
    }

    const totalFields = fields.length;
    const rememberedCounts = {
      question: 0,
      answer: 0,
      reading: 0,
      comprehension: 0,
      // Initialize counts for custom fields if needed
    };

    fields.forEach((field) => {
      if (remembered[field.id]?.question) rememberedCounts.question++;
      if (remembered[field.id]?.answer) rememberedCounts.answer++;
      if (remembered[field.id]?.reading) rememberedCounts.reading++;
      if (remembered[field.id]?.comprehension) rememberedCounts.comprehension++;
      // Count custom fields if applicable
      field.customFields.forEach((customField) => {
        // Logic to count remembered custom fields if needed
      });
    });

    const calculatePercentage = (count) => (count / totalFields) * 100;

    setPercentages({
      question: calculatePercentage(rememberedCounts.question),
      answer: calculatePercentage(rememberedCounts.answer),
      reading: calculatePercentage(rememberedCounts.reading),
      comprehension: calculatePercentage(rememberedCounts.comprehension),
      // Calculate percentage for custom fields if needed
    });

    console.log("Fields submitted:", fields);
  };

  return (
    <div className="App">
      <button onClick={addField}>Add Field</button>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.id} className="field-container">
            <div className="standard-fields">
              <label>Question *</label>
              <input
                value={field.question}
                onChange={(e) => updateField(field.id, { question: e.target.value })}
                required
              />
              <label>Answer *</label>
              <input
                value={field.answer}
                onChange={(e) => updateField(field.id, { answer: e.target.value })}
                required
              />
              <label>Reading</label>
              <input
                value={field.reading}
                onChange={(e) => updateField(field.id, { reading: e.target.value })}
              />
              <label>Comprehension</label>
              <input
                value={field.comprehension}
                onChange={(e) => updateField(field.id, { comprehension: e.target.value })}
              />
            </div>

            <div className="custom-fields">
              {field.customFields.map((customField, index) => (
                <div key={index}>
                  <label>{customField.type}</label>
                  <input
                    value={customField.value}
                    onChange={(e) => handleCustomFieldChange(field.id, index, e.target.value)}
                  />
                  <button type="button" onClick={() => removeCustomField(field.id, index)}>Remove</button>
                </div>
              ))}
              <div>
                <input
                  type="text"
                  placeholder="Type of Custom Field"
                  value={customField}
                  onChange={handleCustomField}
                />
                <button type="button" onClick={() => addCustomField(field.id,customField)}>Add Custom Field</button>
              </div>
            </div>

            <button type="button" onClick={() => deleteField(field.id)}>Delete Field</button>

            <div className="remember-fields">
              <label>
                Remember Question:
                <input
                  type="checkbox"
                  checked={remembered[field.id]?.question || false}
                  onChange={() => toggleRemember(field.id, "question")}
                />
              </label>
              <label>
                Remember Answer:
                <input
                  type="checkbox"
                  checked={remembered[field.id]?.answer || false}
                  onChange={() => toggleRemember(field.id, "answer")}
                />
              </label>
              <label>
                Remember Reading:
                <input
                  type="checkbox"
                  checked={remembered[field.id]?.reading || false}
                  onChange={() => toggleRemember(field.id, "reading")}
                />
              </label>
              <label>
                Remember Comprehension:
                <input
                  type="checkbox"
                  checked={remembered[field.id]?.comprehension || false}
                  onChange={() => toggleRemember(field.id, "comprehension")}
                />
              </label>
            </div>
          </div>
        ))}
        <button type="submit">Submit Fields</button>
      </form>

      <div className="percentages">
        <h2>Percentages</h2>
        {Object.keys(percentages).map((key) => (
          <p key={key}>{key}: {percentages[key]?.toFixed(2)}%</p>
        ))}
      </div>
    </div>
  );
}

