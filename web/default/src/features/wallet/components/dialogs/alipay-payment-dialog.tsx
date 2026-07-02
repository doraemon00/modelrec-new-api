/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface AlipayPaymentDialogProps {
  open: boolean
  /** Invoked by both buttons — the page is reloaded unconditionally. */
  onFinish: () => void
}

/**
 * Alipay payment in-progress overlay.
 *
 * After the Alipay create API succeeds we open the payment link in a new tab
 * and show this mask. It cannot be dismissed by overlay click or Escape; the
 * only way out is one of the two buttons, both of which reload the page.
 */
export function AlipayPaymentDialog({ open, onFinish }: AlipayPaymentDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} className='max-sm:w-[calc(100vw-1.5rem)] sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            {t('Payment in progress')}
          </DialogTitle>
          <DialogDescription>
             请在新标签页中完成付款。完成后，刷新此页面。
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col items-center gap-4 py-6'>
          <Loader2 className='text-primary h-12 w-12 animate-spin' />
          <p className='text-muted-foreground text-sm'>{t('Payment in progress')}</p>
        </div>

        <DialogFooter className='grid grid-cols-1 gap-0'>

          <Button onClick={onFinish}>确认刷新页面</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
