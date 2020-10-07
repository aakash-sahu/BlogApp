import pandas as pd
import numpy as np
from tqdm import tqdm, trange
import torch
from torch.utils.data import TensorDataset, DataLoader, RandomSampler, SequentialSampler
from transformers import BertTokenizer, BertConfig
from transformers import BertForTokenClassification
import os
from nltk.tokenize import sent_tokenize
import pandas as pd

tag2idx = {'B': 0, 'I': 1, 'O': 2}
tags_vals = ['B', 'I', 'O']

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased', do_lower_case=True)
print(os.getcwd())
model = BertForTokenClassification.from_pretrained(os.path.join(os.getcwd(),'app', 'ML','bert_topic_model'))
model = model.cpu()

def keywordextract_saved(sentence, pred_type="prod", device="cpu"):
    text = sentence
    tkns = tokenizer.tokenize(text)
#     print(len(tkns), tkns)
    indexed_tokens = tokenizer.convert_tokens_to_ids(tkns)
    segments_ids = [0] * len(tkns)
    tokens_tensor = torch.tensor([indexed_tokens]).to(device)
    segments_tensors = torch.tensor([segments_ids]).to(device)
    model.eval()
    prediction = []
    output = model(tokens_tensor, token_type_ids=None,
                                  attention_mask=segments_tensors)
    # print(output)
    logit = output[0]
    logit = logit.detach().cpu().numpy()
    prediction.extend([list(p) for p in np.argmax(logit, axis=2)])
    # print(prediction)
    final_topics =[]
    pos_num = -99
    if pred_type == 'prod':
        for k, j in enumerate(prediction[0]):
            if j==1 or j==0:
                keyword = tokenizer.convert_ids_to_tokens(tokens_tensor[0].to('cpu').numpy())[k]
                if pos_num+1 == k:
                    final_topics[-1] = final_topics[-1] + ' ' + keyword
                else:
                    final_topics.append(keyword)
                pos_num = k
        return final_topics
    if pred_type == 'validation':
        for k, j in enumerate(prediction[0]):
            if j==1 or j==0:
                keyword = tokenizer.convert_ids_to_tokens(tokens_tensor[0].to('cpu').numpy())[k]
                keyword_type = tags_vals[j]
                keyword_token = [(keyword, keyword_type)]
                if pos_num+1 == k:
                    final_topics[-1].append((keyword, keyword_type))
                else:
                    final_topics.append(keyword_token)
                pos_num = k
        return final_topics
        # logic can be simplified by putting if condition on pred type inside the for loop
    

def get_topic_pred(input_text, pred_type="prod" ):
    sentences = sent_tokenize(input_text)
    all_keywords = []
    if pred_type=="prod":
        for i, sentence in enumerate(sentences):
            key = keywordextract_saved(sentence, pred_type)
            all_keywords.append(key)
        print(all_keywords)
        return [j for i in all_keywords for j in i]
    elif pred_type == "validation":
        for i, sentence in enumerate(sentences):
            sent_keywords = {}
            key = keywordextract_saved(sentence, pred_type)
            sent_keywords['SentenceNum'] = i+1
            sent_keywords['Sentence'] = sentence
            sent_keywords['KeyphraseAndTag'] = key
            all_keywords.append(sent_keywords)
        output = pd.DataFrame(all_keywords)
        print(output.head())
        return output.to_json(orient="records")

        


