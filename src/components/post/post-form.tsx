'use client'

import { Button, Group, Stack, TextInput, Textarea } from '@mantine/core'
import { IconArrowRight, IconSend } from '@tabler/icons-react'
import { type FormEvent, useRef } from 'react'

interface PostFormProps {
  title: string
  content: string
  isModerating: boolean
  isLocked: boolean
  isSubmitBlocked: boolean
  onTitleChange: (value: string) => void
  onContentChange: (value: string, cursorPos: number) => void
  onSubmit: () => void
  onContinue: () => void
}

export function PostForm({
  title,
  content,
  isModerating,
  isLocked,
  isSubmitBlocked,
  onTitleChange,
  onContentChange,
  onSubmit,
  onContinue,
}: PostFormProps) {
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const canSubmit =
    title.trim().length > 0 && content.trim().length > 0 && !isLocked && !isSubmitBlocked

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (canSubmit && !isModerating) onSubmit()
  }

  const handleContinue = () => {
    onContinue()
    contentRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        <TextInput
          label="Title"
          placeholder="Give your post a title"
          size="md"
          value={title}
          onChange={(event) => onTitleChange(event.currentTarget.value)}
          disabled={isModerating}
          readOnly={isLocked}
          required
        />

        <Textarea
          ref={contentRef}
          label="Content"
          placeholder="Write your post..."
          size="md"
          minRows={8}
          autosize
          value={content}
          onChange={(event) => onContentChange(event.currentTarget.value, event.currentTarget.selectionStart)}
          disabled={isModerating}
          readOnly={isLocked}
          required
        />

        <Group>
          <Button
            type="submit"
            size="md"
            leftSection={<IconSend size={18} />}
            loading={isModerating}
            loaderProps={{ type: 'dots' }}
            disabled={!canSubmit}
          >
            {isModerating ? 'Moderating...' : 'Create Post'}
          </Button>
          {isLocked && (
            <Button
              type="button"
              size="md"
              variant="light"
              rightSection={<IconArrowRight size={18} />}
              onClick={handleContinue}
            >
              Continue
            </Button>
          )}
        </Group>
      </Stack>
    </form>
  )
}
