import torch
from torch import nn, optim
import torch.nn.functional as F
import numpy as np

in_size = 28*28

class Net(nn.Module):
    
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(in_channels = 1, out_channels = 8, kernel_size = 3, padding = 1)
        self.conv2 = nn.Conv2d(in_channels = 8, out_channels = 32, kernel_size = 3, padding = 1)
        self.pool = nn.MaxPool2d(kernel_size = 2, stride = 2)
        
        self.fc1 = nn.Linear(in_features = 32*7*7, out_features = 512)
        self.fc2 = nn.Linear(in_features = 512, out_features = 10)
        self.dropout = nn.Dropout(p = 0.3)
        
    def forward(self,x):
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))
        x = x.view(-1,32*7*7)
        x = self.dropout(F.relu(self.fc1(x)))
        x = F.log_softmax(self.fc2(x),dim = 1)
        return x


def load_cnn_model(path):
    model = Net()
    with open(path, 'rb') as f:
        model.load_state_dict(torch.load(path, map_location='cpu'))
    return model

def cnn_digit_predictions(model, image_data):
    with torch.no_grad():
        test_image = torch.from_numpy(image_data).view(1,1,28,28)
        output = torch.exp(model(test_image)).numpy()
        output = output.flatten().round(4).tolist()
        output = [100*prob for prob in output]
        return output