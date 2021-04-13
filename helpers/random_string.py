import random

ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

def generate_random_string(length=8, alphapet=ALPHABET):
    string = ""

    for i in range(length):
        index = random.randint(0, len(alphapet) - 1)
        char = alphapet[index]
        string += char

    return string
