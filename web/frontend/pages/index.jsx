import {
  Page,
  LegacyCard,
  ResourceList,
  Button,
  Icon,
  Text,
  IndexTable
} from "@shopify/polaris";

import {
  DeleteMinor
} from '@shopify/polaris-icons';

import { ResourcePicker } from '@shopify/app-bridge-react'
import './index-styles.css';
import { useEffect, useState } from "react";




const StaticRules = [
  {
      id: 1,
      name: "My Custom Rule 1",
      keyWords: [
          "word1",
          "word2"
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
          "word1",
          "word2"
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

  useEffect(() => {
    setOriginalRules(StaticRules);
    setRules(StaticRules);
  }, [])
  

  return (
    <Page
      title="Rivka Search"
      subtitle="Shopify Custom Seach"
      divider={true}
      primaryAction={{content: "Add New Search Rule", onAction: handleAddRule }}
      fullWidth={true}
    >

      //ADD A SHOPIFY POLARIS SAVE BAR EVERYTIME RULES STATE IS DIFFERENT FROM ORIGINAL RULES
      <div className="rules-list">
        <LegacyCard title="Your Search Rules" sectioned >
          <IndexTable 
            resourceName={{singular: 'rule',plural: 'rules'}}
            headings={[
              {title: 'Rule'},
              {title: 'Key Word'},
              {title: 'Product List'},
              {title: 'Collection List'},
              {title: 'Status'}
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
                <IndexTable.Cell><Text>{rule.name}</Text></IndexTable.Cell>
                <IndexTable.Cell><Text>{rule.keyWords.slice(0,3).join(', ')}</Text></IndexTable.Cell>
                <IndexTable.Cell>
                  <Button
                    fullWidth={false}
                    plain={rule.productList.length > 0}
                    monochrome={rule.productList.length == 0}
                    onClick={(e) => {e.preventDefault(); handleOpenPicker(rule, "Product")}}
                  >
                    <div className="button-text-wrapper">{rule.productList.length > 0 ? rule.productList.map(product => product.title).slice(0,3).join(' , ') : "Add products to this rule."}</div>
                  </Button>
                </IndexTable.Cell>
                <IndexTable.Cell>
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
                  <Text>Switch</Text>
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
