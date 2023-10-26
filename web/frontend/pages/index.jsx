import {
  Page,
  LegacyCard,
  Icon,
  Button,
  Tag,
  Text,
  IndexTable,
  TextField
} from "@shopify/polaris";

import {
  DeleteMinor,
  CancelSmallMinor,
  PlusMinor,
  EditMinor
} from '@shopify/polaris-icons';

import { ResourcePicker } from '@shopify/app-bridge-react'
import './index-styles.css';
import { useEffect, useState } from "react";

import Switch from "../components/Switch";
import objectDeepCompare from "../utils/objectDeepCompare";


const StaticRules = [
  {
      id: 1,
      name: "My Custom Rule 1",
      keyWords: [
        {id: 1, key: "word1" },
        {id: 2, key: "word2" }
      ],
      productList: [
      ],
      collectionList: [],
      enabled: true
  },
  {
      id: 2,
      name: "My Custom Rule 2",
      keyWords: [
          {id: 3, key: "word3" },
          {id: 4, key: "word4" }
      ],
      productList: [
        
        {
          id: "gid://shopify/Product/8040588968193",
          title: "#CherylThePigeon¸ Tee"
        },
        {
            id: "gid://shopify/Product/8040589820161",
            title: "3/4 Logo Work Shirt"
        },
        {
            id: "gid://shopify/Product/8040582643969",
            title: "3/4 Logo Work Shirt + AJ Performance Work Shirt + Baseline Bandana"
        },
        {
            id: "gid://shopify/Product/8040587395329",
            title: "AJ Performance Work Shirt"
        },
        {
            id: "gid://shopify/Product/8040588837121",
            title: "Allyson Trucker Jacket"
        },
        {
            id: "gid://shopify/Product/8040581267713",
            title: "Anna Pullover Hoodie"
        }
      ],
      collectionList: [],
      enabled: true
  }
];

let whatchRulesChange = false;

export default function HomePage() {
  const [showPicker, setPickerVisibility] = useState(false);
  const [pickerInitialSelectionIds, setPickerInitialSelectionIds] = useState([]);
  const [pickerRuleId, setPickerRuleId] = useState(-1);
  const [pickerType, setPickerType] = useState('Product');
  const [rules, setRules] = useState([]);
  const [originalRules, setOriginalRules] = useState([]);


  const handleAddRule = () => {
    // CREATES A EMPTY DEFAULT RULE
    console.log('Rules')
    console.log(rules)
    console.log('States')
    console.log(showPicker)
    console.log(pickerRuleId)
    console.log(pickerInitialSelectionIds)
    console.log(pickerType)
  };

  const askSave = () => {
    const answer = confirm('save?')
    console.log(answer)
    if(answer) {
      setOriginalRules(rules)
    } else {
      setRules(originalRules)
    }
  }
  
  const handleOpenPicker = (rule, newPickerType) => {
    if(newPickerType === "Product") {
      setPickerInitialSelectionIds(rule.productList.map(product => ({id: product.id})));
    }

    if(newPickerType === "Collection") {
      setPickerInitialSelectionIds(rule.collectionList.map(collection => ({id: collection.id})));
    }

    setPickerType(newPickerType);
    setPickerRuleId(rule.id);
    setPickerVisibility(true);
  };

  const handlePickerSelection = (selection) => {
    setRules(rules => {
      const updatedRules = [ ...rules ];
      if(pickerType === "Product") {
        updatedRules.find(rule => rule.id === pickerRuleId).productList = selection.map(({id, title}) => ({id, title}))
      }
      if(pickerType === "Collection") {
        updatedRules.find(rule => rule.id === pickerRuleId).collectionList = selection.map(({id, title}) => ({id, title}))
      }
      return updatedRules;
    })
    clearPickerState();
    
  }
  
  const clearPickerState = () => {
    setPickerVisibility(false);
    setPickerType('Product');
    setPickerRuleId(-1);
    setPickerInitialSelectionIds([]);
  }

  const handleDeleteRule = (deletingRule) => {
    //TODO LATER CREATE A CONFIRM POPUP
    setRules(rules => {
      const updatedRules = [ ...rules ];
      return updatedRules.filter(rule => rule.id !== deletingRule.id);
    })
  };

  const handleSwitchClick = (switchRuleId) => {
    setRules(rules => {
      const updatedRules = [ ...rules ];
      updatedRules.find(rule => rule.id === switchRuleId).enabled = !updatedRules.find(rule => rule.id === switchRuleId).enabled
      return updatedRules;
    })
  }
  const handleTagRemove = (tagRuleId, keyId) => {
    console.log(`removing key ${keyId} from rule ${tagRuleId}`)
    setRules(rules => {
      const updatedRules = [ ...rules ];
      const newKeys = updatedRules.find(rule => rule.id === tagRuleId).keyWords.filter(({id }) => id !== keyId)
      console.log(newKeys)
      updatedRules.find(rule => rule.id === tagRuleId).keyWords = newKeys
      console.log(updatedRules)
      return updatedRules;
    })
  }

  const handleTagAdd = (tagRuleId) => {};

  const handleNameEdit = (nameRuleId) => {
    document.getElementById(`rule-${nameRuleId}-name`).style.display = 'none';
    document.getElementById(`rule-${nameRuleId}-name-edit`).style.display = 'block';
  };

  const handleRuleNameChange = (e) => {};
  /*
  TODO: track rules changes and save bar...
  useEffect(() => {
    console.log('rules changed')
    console.log(whatchRulesChange)
    if(whatchRulesChange === false) {
      whatchRulesChange = true;
    } else {
      alert('true')
    }
  }, [rules]);
  */
  useEffect(() => {
    setOriginalRules(StaticRules);
    setRules(StaticRules);
    console.log('rules and original rules loaded from server')
  }, []);
  

  return (
    <Page
      title="Rivka Search"
      subtitle="Shopify Custom Seach"
      divider={true}
      primaryAction={{content: "Add New Search Rule", onAction: handleAddRule }}
      fullWidth={true}
    >

      {/* //ADD A SHOPIFY POLARIS SAVE BAR EVERYTIME RULES STATE IS DIFFERENT FROM ORIGINAL RULES */}
      <div className="rules-list">
        <LegacyCard title="Your Search Rules" sectioned >
          <IndexTable 
            resourceName={{singular: 'rule',plural: 'rules'}}
            headings={[
              {title: 'Rule'},
              {title: 'Key Word'},
              {title: 'Product List'},
              {title: 'Collection List'},
              {title: 'Status'},
              {title: 'Delete', hidden: true}
            ]}
            itemCount={rules.length}
            selectable={false}
          > 
            {rules.map((rule, index) => (
              <IndexTable.Row 
                id={rule.id}
                key={index}
                position={index}
              >
                <IndexTable.Cell className="name-cell">
                  <button className="name-edit-button" onClick={(e) => {e.preventDefault(); handleNameEdit(rule.id)}} id={`rule-${rule.id}-name`}>
                    <Text>
                      {rule.name}
                    </Text>
                  </button>
                  <div id={`rule-${rule.id}-name-edit`} style={{display: 'none'}}>
                    <TextField
                      labelHidden={true}
                      value={rule.name}
                      onChange={() => {handleRuleNameChange(e, rule.id)}}
                      autoComplete="off"
                    />
                  </div>
                </IndexTable.Cell>
                <IndexTable.Cell className="tag-cell">
                  {rule.keyWords.map(({id: keyId, key}, index) => (
                    <div className="tag-wrapper" key={`tag-wrapper-${rule.id}-${index}`}>
                      <Tag key={`tag-${rule.id}-${index}`} >
                        <div className="tag-text-wrapper">
                          {key}
                          <button className="tag-remove-button" onClick={(e) => {e.preventDefault(); handleTagRemove(rule.id, keyId)}}><Icon source={CancelSmallMinor} color="base" /></button>
                        </div>
                      </Tag>
                    </div>
                  ))}
                  <button className="tag-add-button" onClick={(e) => {e.preventDefault(); handleTagAdd(rule.id)}}><Icon source={PlusMinor} color="base" /></button>
                </IndexTable.Cell>
                <IndexTable.Cell
                  className={rule.productList.length == 0 ? "add-to-list" : "list"}
                >
                  <Button
                    fullWidth={false}
                    plain={rule.productList.length > 0}
                    monochrome={rule.productList.length == 0}
                    onClick={(e) => {e.preventDefault(); handleOpenPicker(rule, "Product")}}
                  >
                    <div className="button-text-wrapper">{rule.productList.length > 0 ? rule.productList.map(product => product.title).slice(0,3).join(' , ') : "Add products to this rule."}</div>
                  </Button>
                </IndexTable.Cell>
                <IndexTable.Cell
                  className={rule.collectionList.length == 0 ? "add-to-list" : "list"}
                >
                  <div className="button-text-wrapper">
                  <Button
                    fullWidth={false}
                    plain={rule.collectionList.length > 0}
                    monochrome={rule.collectionList.length == 0}
                    onClick={(e) => {e.preventDefault(); handleOpenPicker(rule, "Collection")}}
                  >
                    <div className="button-text-wrapper">{rule.collectionList.length > 0 ? rule.collectionList.map(product => product.title).slice(0,3).join(' , ') : "Add collections to this rule."}</div>
                  </Button>
                  </div>
                </IndexTable.Cell>
                
                <IndexTable.Cell>
                  <Switch
                    name="enabled"
                    id="enbled"
                    labelStyle={{
                      display: "none"
                    }}
                    checked={rule.enabled}
                    onChange={(e) => handleSwitchClick(rule.id)}
                  />
                </IndexTable.Cell>
                
                <IndexTable.Cell>
                  <div className="delete-button">
                    <Button 
                      size="micro"
                      textAlign="center"
                      icon={DeleteMinor}
                      onClick={(e) => {e.preventDefault(); handleDeleteRule(rule)}}
                    ></Button>
                  </div>
                </IndexTable.Cell>
              </IndexTable.Row>
            ))}
          </IndexTable>

          <ResourcePicker 
            selectMultiple={true} 
            open={showPicker}
            showVariants={false}
            resourceType={pickerType} 
            initialSelectionIds={pickerInitialSelectionIds} 
            onSelection={({selection}) => {handlePickerSelection(selection)}} 
            onCancel={(e) => {clearPickerState()}}
          />
        </LegacyCard>
      </div>
    </Page>
  );
}
