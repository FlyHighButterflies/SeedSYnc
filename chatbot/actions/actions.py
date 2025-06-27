# This files contains your custom actions which can be used to run
# custom Python code.

# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List

# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher


# class ActionHelloWorld(Action):

#     def name(self) -> Text:
#         return "action_hello_world"

#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

#         dispatcher.utter_message(text="Hello World!")

#         return []
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

class ActionCheckProduceAvailability(Action):
    def name(self) -> Text:
        return "action_check_produce_availability"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        quantity = tracker.get_slot("quantity")
        produce_type = tracker.get_slot("produce_type")
        
        # Simulate checking availability (in real app, this would query database)
        available_produce = {
            "tomatoes": {"quantity": 250, "price": 65, "organic": True},
            "organic tomatoes": {"quantity": 250, "price": 65, "organic": True},
            "carrots": {"quantity": 180, "price": 45, "organic": False},
            "potatoes": {"quantity": 300, "price": 35, "organic": False}
        }
        
        if produce_type and produce_type.lower() in available_produce:
            item = available_produce[produce_type.lower()]
            if quantity:
                requested_qty = int(quantity.replace("kg", ""))
                if requested_qty <= item["quantity"]:
                    organic_text = "organic and " if item["organic"] else ""
                    dispatcher.utter_message(
                        text=f"Good morning! Yes, we have about {item['quantity']}kg ready for harvest tomorrow. "
                             f"They're fully {organic_text}freshly picked."
                    )
                else:
                    dispatcher.utter_message(
                        text=f"We have {item['quantity']}kg available, which is less than your requested {quantity}. "
                             f"Would you like to proceed with the available quantity?"
                    )
            else:
                organic_text = "organic and " if item["organic"] else ""
                dispatcher.utter_message(
                    text=f"Yes, we have {item['quantity']}kg of {organic_text}fresh {produce_type} available!"
                )
        else:
            dispatcher.utter_message(
                text="Let me check our current inventory for that produce. "
                     "We have tomatoes, carrots, and potatoes available. "
                     "What specific produce are you looking for?"
            )
        
        return []

class ActionConfirmOrder(Action):
    def name(self) -> Text:
        return "action_confirm_order"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        quantity = tracker.get_slot("quantity") or "200kg"
        produce_type = tracker.get_slot("produce_type") or "organic tomatoes"
        
        # Simulate order confirmation
        dispatcher.utter_message(
            text=f"That works for us. Let's confirm the order and proceed with logistics. Thanks!"
        )
        
        # Follow up with confirmation details
        dispatcher.utter_message(
            text=f"Thank you! Confirming {quantity} at P65/kg. I'll share the delivery details shortly."
        )
        
        return []

class ActionSetUserType(Action):
    def name(self) -> Text:
        return "action_set_user_type"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        intent = tracker.latest_message['intent'].get('name')
        
        if intent == "farmer_seller":
            return [SlotSet("user_type", "farmer")]
        elif intent == "buyer":
            return [SlotSet("user_type", "buyer")]
        
        return []