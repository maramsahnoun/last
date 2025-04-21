import openai

# Remplacez par votre clé API
openai.api_key = "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"

def get_response(user_input):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # ou "gpt-4" si vous y avez accès
        messages=[
            {"role": "user", "content": user_input}
        ]
    )
    return response.choices[0].message['content']

if __name__ == "__main__":
    while True:
        user_input = input("Vous: ")
        if user_input.lower() in ["exit", "quit"]:
            print("Au revoir!")
            break
        response = get_response(user_input)
        print("Bot:", response)