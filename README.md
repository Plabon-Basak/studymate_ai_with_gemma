# StudyMate AI

## Description

StudyMate AI is a simple, polished, AI-powered study assistant that turns any topic into personalized study material using Google's Gemma models via Google AI Studio API. It generates structured explanations, examples, Python code when relevant, key points, and a quiz with answers — all tailored to your chosen language (English or Bangla) and difficulty level (Beginner, Intermediate, Advanced).

## Features

- **AI-Generated Study Material**: Get comprehensive study notes on any topic instantly
- **Multi-Language Support**: English and Bangla support with natural explanations
- **Difficulty Selection**: Customize content for Beginner, Intermediate, or Advanced levels
- **Relevant Examples**: Real-world examples to aid understanding
- **Python Code**: Automatically includes Python code when the topic is programming-related
- **Quiz Generation**: Exactly 5 quiz questions with separate answers
- **Copy Functionality**: One-click copy of complete generated material
- **Gemma API Integration**: Powered by Google AI Studio's Gemma models
- **Clean & Responsive UI**: Works seamlessly on desktop, laptop, and mobile devices
- **Secure**: API keys stored server-side only, never exposed to the frontend

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Python, Flask
- **AI**: Google AI Studio API, Gemma 4
- **Deployment**: Vercel
- **Version Control**: Git, GitHub

## Architecture

```
Frontend (HTML/CSS/JS) → Flask Backend → Gemma API (Google AI Studio)
```

## Local Setup

### Prerequisites

- Python 3.8 or higher
- Git
- Google AI Studio API key ([Get one here](https://aistudio.google.com/apikey))

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/StudyMate-AI.git
cd StudyMate-AI
```

2. Create a virtual environment:

```bash
python -m venv venv
```

3. Activate the virtual environment:

**Windows:**

```bash
venv\Scripts\activate
```

**macOS/Linux:**

```bash
source venv/bin/activate
```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

5. Create a `.env` file from `.env.example`:

```bash
cp .env.example .env  # macOS/Linux
```

Or manually create `.env` on Windows with:

```env
GOOGLE_API_KEY=your_api_key_here
GEMMA_MODEL=gemma-4-26b-a4b-it
```

6. Run the application:

```bash
python app.py
```

7. Open your browser and navigate to `http://localhost:5000`

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GOOGLE_API_KEY` | Yes | Your API key from [Google AI Studio](https://aistudio.google.com/apikey) |
| `GEMMA_MODEL` | No | Gemma model name. Defaults to `gemma-4-26b-a4b-it` |

**Note:** Never commit your actual API key to the repository.

## Deployment

### Deploy to Vercel

1. Install the [Vercel CLI](https://vercel.com/docs/cli):

```bash
npm i -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy from the project directory:

```bash
vercel
```

4. Add environment variables in Vercel dashboard:
   - Go to Project Settings > Environment Variables
   - Add `GOOGLE_API_KEY` and `GEMMA_MODEL`
   
5. Redeploy for changes to take effect.

Alternatively, connect your GitHub repository to Vercel for automatic deployments.

## Usage

1. Open StudyMate AI in your browser
2. Enter a topic (e.g., "Python Lists", "Machine Learning", "Neural Networks")
3. Select your preferred language (English or Bangla)
4. Select difficulty level (Beginner, Intermediate, Advanced)
5. Click "Generate Study Material"
6. Wait for the AI to generate content
7. Review the structured study material with explanation, examples, code, and quiz
8. Click "Copy Study Material" to copy everything to your clipboard

## Error Handling

StudyMate AI gracefully handles common errors:
- Empty topic validation
- API key configuration issues
- Network timeouts
- API rate limits
- Unexpected API responses

User-friendly error messages are displayed without exposing sensitive information.

## Testing

The application has been tested with:
- Programming topics (Python Lists, Functions)
- General topics (Machine Learning, Neural Networks)
- Both English and Bangla languages
- All three difficulty levels
- Error cases and edge conditions

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Powered by [Google AI Studio](https://aistudio.google.com/) and [Gemma](https://ai.google.dev/gemma)
- Built for hackathon demonstration
- Inspired by the goal of making learning accessible to everyone