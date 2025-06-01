interface ParsedButton {
    text: string
    url?: string
    callback_data?: string
}

export function parseButtons(text: string): { text: string; buttons: ParsedButton[][] } {
    const lines = text.trim().split('\n').map(line => line.trim()).filter(Boolean)

    const buttons: ParsedButton[][] = []
    const messageLines: string[] = []

    for (const line of lines) {
        if (line.startsWith(':text:')) {
            const parts = line.split(':')
            if (parts.length >= 4) {
                const btn: ParsedButton = { text: parts[2] }

                if (parts[3] === 'url') {
                    btn.url = parts.slice(4).join(':')
                } else if (parts[3] === 'data') {
                    btn.callback_data = parts.slice(4).join(':')
                }

                buttons.push([btn])
            }
        } else {
            messageLines.push(line)
        }
    }

    return {
        text: messageLines.join('\n'),
        buttons
    }
}
